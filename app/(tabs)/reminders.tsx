import { FadeInCardY } from "@/components/custom/motion";
import { VStack } from "@/components/ui/vstack";
import { TabHeader } from "@/components/pages/shared";
import React, { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Stethoscope, Clock, Calendar, Pill, Bell, ChevronDown, ChevronUp, Filter, Settings } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";

// Types pour les rappels
type ReminderType = 'consultation' | 'medication' | 'followup' | 'appointment';
type ReminderStatus = 'pending' | 'completed' | 'overdue';
type ViewMode = 'timeline' | 'list' | 'calendar';

interface Reminder {
  id: string;
  title: string;
  patientName: string;
  type: ReminderType;
  status: ReminderStatus;
  dateTime: Date;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Données mockées enrichies pour les rappels
const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Consultation de suivi',
    patientName: 'Lucas Martin',
    type: 'followup',
    status: 'pending',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Dans 2h
    description: 'Suivi nutritionnel mensuel',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Prise de médicaments',
    patientName: 'Sophie Dubois',
    type: 'medication',
    status: 'pending',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Dans 4h
    description: 'Vitamines D - 2 comprimés',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Rendez-vous pédiatre',
    patientName: 'Emma Leroy',
    type: 'appointment',
    status: 'pending',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
    description: 'Consultation de routine',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Consultation initiale',
    patientName: 'Pierre Durand',
    type: 'consultation',
    status: 'overdue',
    dateTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
    description: 'Première consultation',
    priority: 'high'
  },
  {
    id: '5',
    title: 'Contrôle mensuel',
    patientName: 'Marie Leroy',
    type: 'followup',
    status: 'completed',
    dateTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
    description: 'Poids et taille vérifiés',
    priority: 'low'
  }
];
const getReminderIcon = (type: ReminderType) => {
  switch (type) {
    case 'consultation':
      return Stethoscope;
    case 'medication':
      return Pill;
    case 'followup':
      return Clock;
    case 'appointment':
      return Calendar;
    default:
      return Bell;
  }
};

const getStatusColor = (status: ReminderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
};

const formatDateTime = (date: Date): { time: string; isFuture: boolean } => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return { time: `Dans ${diffDays}j`, isFuture: true };
  } else if (diffHours > 0) {
    return { time: `Dans ${diffHours}h`, isFuture: true };
  } else if (diffHours < 0) {
    return { time: `-${Math.abs(diffHours)}h`, isFuture: false };
  } else {
    return { time: 'Maintenant', isFuture: true };
  }
};
export default function Reminders() {
  const [selectedFilter, setSelectedFilter] = useState<ReminderStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredReminders = selectedFilter === 'all'
    ? mockReminders
    : mockReminders.filter(reminder => reminder.status === selectedFilter);

  // Trier par date pour la timeline
  const sortedReminders = [...filteredReminders].sort((a, b) =>
    a.dateTime.getTime() - b.dateTime.getTime()
  );

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  // Filtres actifs pour les chips
  const activeFilters = [
    { key: 'pending', label: 'En attente', count: mockReminders.filter(r => r.status === 'pending').length, active: selectedFilter === 'pending' },
    { key: 'overdue', label: 'En retard', count: mockReminders.filter(r => r.status === 'overdue').length, active: selectedFilter === 'overdue' },
  ].filter(f => f.count > 0);

  return (
    <VStack className={"flex-1 bg-background-primary"}>
      {/* Header compact */}
      <HStack className="px-4 py-4 bg-background-secondary elevation-sm">
        <VStack className="flex-1">
          <Text className="font-h3 text-xl font-bold text-typography-primary">
            Mes Rappels
          </Text>
          <HStack className="items-center gap-2 mt-1">
            <Badge className="bg-primary-c_light/20 text-primary-c_light">
              <Text className="text-xs">{mockReminders.length} rappels</Text>
            </Badge>
            {activeFilters.length > 0 && (
              <Text className="text-xs text-typography-primary_light">
                {activeFilters.length} filtres actifs
              </Text>
            )}
          </HStack>
        </VStack>

        {/* Bouton paramètres */}
        <Pressable
          onPress={() => setShowSettings(true)}
          className="p-2 rounded-lg bg-background-primary/50"
        >
          <Icon as={Settings} className="h-5 w-5 text-typography-primary" />
        </Pressable>
      </HStack>

      {/* Chips de filtres actifs */}
      {activeFilters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2"
        >
          <HStack className="gap-2">
            <Pressable
              onPress={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full border ${
                selectedFilter === 'all'
                  ? 'bg-primary-c_light border-primary-c_light'
                  : 'bg-background-secondary border-background-secondary'
              }`}
            >
              <Text className={`text-xs font-medium ${
                selectedFilter === 'all' ? 'text-white' : 'text-typography-primary'
              }`}>
                Tous ({mockReminders.length})
              </Text>
            </Pressable>

            {activeFilters.map((filter) => (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key as ReminderStatus)}
                className={`px-3 py-1 rounded-full border ${
                  filter.active
                    ? 'bg-primary-c_light border-primary-c_light'
                    : 'bg-background-secondary border-background-secondary'
                }`}
              >
                <Text className={`text-xs font-medium ${
                  filter.active ? 'text-white' : 'text-typography-primary'
                }`}>
                  {filter.label} ({filter.count})
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      )}

      {/* Contenu principal */}
      <VStack className="flex-1 px-4">
        {viewMode === 'timeline' && (
          <TimelineView
            reminders={sortedReminders}
            onToggleExpansion={toggleCardExpansion}
            expandedCards={expandedCards}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            reminders={sortedReminders}
            onToggleExpansion={toggleCardExpansion}
            expandedCards={expandedCards}
          />
        )}

        {viewMode === 'calendar' && (
          <CalendarView reminders={sortedReminders} />
        )}
      </VStack>

      {/* ActionSheet pour les paramètres */}
      <Actionsheet isOpen={showSettings} onClose={() => setShowSettings(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          <VStack className="w-full px-4 pb-4">
            <Text className="font-h4 text-lg font-semibold text-typography-primary text-center mb-4">
              Paramètres d'affichage
            </Text>

            {/* Section Vues */}
            <VStack className="mb-6">
              <Text className="font-medium text-sm text-typography-primary mb-3">
                📊 Vue d'affichage
              </Text>
              <VStack className="gap-2">
                {[
                  { key: 'timeline', label: '⏱️ Vue chronologique', desc: 'Par date et heure' },
                  { key: 'list', label: '📋 Vue liste', desc: 'Format détaillé' },
                  { key: 'calendar', label: '📅 Vue calendrier', desc: 'Cette semaine' }
                ].map((mode) => (
                  <ActionsheetItem
                    key={mode.key}
                    onPress={() => {
                      setViewMode(mode.key as ViewMode);
                      setShowSettings(false);
                    }}
                    className={viewMode === mode.key ? 'bg-primary-c_light/10' : ''}
                  >
                    <HStack className="items-center gap-3">
                      <Text className="text-base">{mode.label}</Text>
                      {viewMode === mode.key && (
                        <Icon as={Bell} className="h-4 w-4 text-primary-c_light ml-auto" />
                      )}
                    </HStack>
                    <ActionsheetItemText className="text-sm text-typography-primary_light">
                      {mode.desc}
                    </ActionsheetItemText>
                  </ActionsheetItem>
                ))}
              </VStack>
            </VStack>

            {/* Section Filtres */}
            <VStack>
              <Text className="font-medium text-sm text-typography-primary mb-3">
                🔍 Filtres disponibles
              </Text>
              <VStack className="gap-2">
                {[
                  { key: 'all', label: 'Tous les rappels', count: mockReminders.length },
                  { key: 'pending', label: 'En attente', count: mockReminders.filter(r => r.status === 'pending').length },
                  { key: 'overdue', label: 'En retard', count: mockReminders.filter(r => r.status === 'overdue').length },
                  { key: 'completed', label: 'Terminés', count: mockReminders.filter(r => r.status === 'completed').length }
                ].map((filter) => (
                  <ActionsheetItem
                    key={filter.key}
                    onPress={() => {
                      setSelectedFilter(filter.key as any);
                      setShowSettings(false);
                    }}
                    className={selectedFilter === filter.key ? 'bg-primary-c_light/10' : ''}
                  >
                    <HStack className="items-center justify-between">
                      <Text className="text-base">{filter.label}</Text>
                      <HStack className="items-center gap-2">
                        <Badge className="bg-primary-c_light/20 text-primary-c_light">
                          <Text className="text-xs">{filter.count}</Text>
                        </Badge>
                        {selectedFilter === filter.key && (
                          <Icon as={Bell} className="h-4 w-4 text-primary-c_light" />
                        )}
                      </HStack>
                    </HStack>
                  </ActionsheetItem>
                ))}
              </VStack>
            </VStack>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}

// Composant Timeline View - Vue innovante
interface TimelineViewProps {
  reminders: Reminder[];
  onToggleExpansion: (id: string) => void;
  expandedCards: Set<string>;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  reminders,
  onToggleExpansion,
  expandedCards
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack className="gap-6 py-4">
        {reminders.length === 0 ? (
          <VStack className="items-center py-12">
            <Icon as={Bell} className="h-16 w-16 text-typography-primary_light/50 mb-4" />
            <Text className="text-lg font-medium text-typography-primary_light">
              Aucun rappel trouvé
            </Text>
            <Text className="text-sm text-typography-primary_light/70 text-center">
              Tous vos rappels seront affichés ici
            </Text>
          </VStack>
        ) : (
          reminders.map((reminder, index) => (
            <TimelineItem
              key={reminder.id}
              reminder={reminder}
              isLast={index === reminders.length - 1}
              isExpanded={expandedCards.has(reminder.id)}
              onToggle={() => onToggleExpansion(reminder.id)}
            />
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

interface TimelineItemProps {
  reminder: Reminder;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  reminder,
  isLast,
  isExpanded,
  onToggle
}) => {
  const animatedHeight = useSharedValue(isExpanded ? 120 : 80);

  React.useEffect(() => {
    animatedHeight.value = withSpring(isExpanded ? 120 : 80);
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'consultation':
        return Stethoscope;
      case 'medication':
        return Pill;
      case 'followup':
        return Clock;
      case 'appointment':
        return Calendar;
      default:
        return Bell;
    }
  };

  const getStatusColor = (status: ReminderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const { time, isFuture } = formatDateTime(reminder.dateTime);

  return (
    <HStack className="relative">
      {/* Ligne verticale de la timeline */}
      <VStack className="items-center w-8">
        <Box className={`w-1 bg-gradient-to-b from-primary-c_light to-primary-c_light/50 rounded-full ${isLast ? 'h-16' : 'h-full'}`} />
        <Box className={`absolute top-2 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(reminder.status)}`} />
      </VStack>

      {/* Contenu du rappel */}
      <VStack className="flex-1 ml-4">
        <Animated.View style={animatedStyle}>
          <Pressable onPress={onToggle} className="bg-background-secondary rounded-2xl p-4 elevation-sm active:scale-95 transition-transform">
            <HStack className="items-start justify-between">
              <HStack className="items-start flex-1 gap-3">
                <Avatar className="h-12 w-12 rounded-xl bg-primary-c_light/20 mt-1">
                  <Icon
                    as={getReminderIcon(reminder.type)}
                    className="h-6 w-6 text-primary-c_light"
                  />
                </Avatar>

                <VStack className="flex-1">
                  <HStack className="items-center justify-between mb-1">
                    <Text className="font-h4 text-base font-semibold text-typography-primary flex-1">
                      {reminder.title}
                    </Text>
                    <HStack className="items-center gap-2">
                      <Box className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority)}`} />
                      <Icon
                        as={isExpanded ? ChevronUp : ChevronDown}
                        className="h-4 w-4 text-typography-primary_light"
                      />
                    </HStack>
                  </HStack>

                  <Text className="font-body text-sm text-typography-primary_light mb-1">
                    {reminder.patientName}
                  </Text>

                  <HStack className="items-center justify-between">
                    <Badge className={`${getStatusColor(reminder.status).replace('bg-', 'bg-').replace('500', '100')} ${getStatusColor(reminder.status).replace('bg-', 'text-').replace('500', '800')} border ${getStatusColor(reminder.status).replace('bg-', 'border-').replace('500', '200')}`}>
                      <Text className="text-xs capitalize">
                        {reminder.status === 'pending' ? 'En attente' :
                         reminder.status === 'completed' ? 'Terminé' : 'En retard'}
                      </Text>
                    </Badge>

                    <Text className={`font-medium text-sm ${isFuture ? 'text-blue-600' : 'text-red-600'}`}>
                      {time}
                    </Text>
                  </HStack>

                  {isExpanded && reminder.description && (
                    <Text className="font-light text-sm text-typography-primary_light/80 mt-3 pt-3 border-t border-background-primary">
                      {reminder.description}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </HStack>
          </Pressable>
        </Animated.View>
      </VStack>
    </HStack>
  );
};

// Composant List View - Vue liste améliorée
const ListView: React.FC<TimelineViewProps> = ({
  reminders,
  onToggleExpansion,
  expandedCards
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack className="gap-3 py-4">
        {reminders.length === 0 ? (
          <VStack className="items-center py-12">
            <Icon as={Bell} className="h-16 w-16 text-typography-primary_light/50 mb-4" />
            <Text className="text-lg font-medium text-typography-primary_light">
              Aucun rappel trouvé
            </Text>
          </VStack>
        ) : (
          reminders.map((reminder) => (
            <ListItem
              key={reminder.id}
              reminder={reminder}
              isExpanded={expandedCards.has(reminder.id)}
              onToggle={() => onToggleExpansion(reminder.id)}
            />
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

interface ListItemProps {
  reminder: Reminder;
  isExpanded: boolean;
  onToggle: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ reminder, isExpanded, onToggle }) => {
  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'consultation':
        return Stethoscope;
      case 'medication':
        return Pill;
      case 'followup':
        return Clock;
      case 'appointment':
        return Calendar;
      default:
        return Bell;
    }
  };

  const getStatusColor = (status: ReminderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const { time, isFuture } = formatDateTime(reminder.dateTime);

  return (
    <Pressable onPress={onToggle} className="bg-background-secondary rounded-xl p-4 elevation-sm border-l-4 border-primary-c_light active:scale-95 transition-transform">
      <HStack className="items-start gap-3">
        <Avatar className="h-10 w-10 rounded-lg bg-primary-c_light/20">
          <Icon
            as={getReminderIcon(reminder.type)}
            className="h-5 w-5 text-primary-c_light"
          />
        </Avatar>

        <VStack className="flex-1">
          <HStack className="items-start justify-between mb-2">
            <Text className="font-h4 text-sm font-semibold text-typography-primary flex-1">
              {reminder.title}
            </Text>
            <Icon
              as={isExpanded ? ChevronUp : ChevronDown}
              className="h-4 w-4 text-typography-primary_light ml-2"
            />
          </HStack>

          <Text className="font-body text-xs text-typography-primary_light mb-2">
            {reminder.patientName}
          </Text>

          <HStack className="items-center justify-between">
            <Badge className={getStatusColor(reminder.status)}>
              <Text className="text-xs capitalize">
                {reminder.status === 'pending' ? 'En attente' :
                 reminder.status === 'completed' ? 'Terminé' : 'En retard'}
              </Text>
            </Badge>

            <Text className={`font-medium text-sm ${isFuture ? 'text-blue-600' : 'text-red-600'}`}>
              {time}
            </Text>
          </HStack>

          {isExpanded && reminder.description && (
            <Text className="font-light text-sm text-typography-primary_light/80 mt-3 pt-3 border-t border-background-primary">
              {reminder.description}
            </Text>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
};

// Composant Calendar View - Vue calendrier simplifiée
const CalendarView: React.FC<{ reminders: Reminder[] }> = ({ reminders }) => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const weekReminders = reminders.filter(reminder =>
    reminder.dateTime >= today && reminder.dateTime <= nextWeek
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack className="gap-4 py-4">
        <Text className="font-h3 text-lg font-semibold text-typography-primary text-center">
          Cette semaine
        </Text>

        {weekReminders.length === 0 ? (
          <VStack className="items-center py-12">
            <Icon as={Calendar} className="h-16 w-16 text-typography-primary_light/50 mb-4" />
            <Text className="text-lg font-medium text-typography-primary_light">
              Aucun rappel cette semaine
            </Text>
          </VStack>
        ) : (
          weekReminders.map((reminder) => (
            <CalendarItem key={reminder.id} reminder={reminder} />
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

const CalendarItem: React.FC<{ reminder: Reminder }> = ({ reminder }) => {
  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'consultation':
        return Stethoscope;
      case 'medication':
        return Pill;
      case 'followup':
        return Clock;
      case 'appointment':
        return Calendar;
      default:
        return Bell;
    }
  };

  const day = reminder.dateTime.toLocaleDateString('fr-FR', { weekday: 'short' });
  const date = reminder.dateTime.getDate();

  return (
    <Pressable className="bg-background-secondary rounded-xl p-4 elevation-sm items-center gap-4 active:scale-95 transition-transform">
      <HStack className="items-center gap-4">
        <VStack className="items-center min-w-12">
          <Text className="font-bold text-lg text-primary-c_light">{date}</Text>
          <Text className="font-medium text-xs text-typography-primary_light uppercase">
            {day}
          </Text>
        </VStack>

        <Box className="w-px h-12 bg-primary-c_light/30" />

        <Avatar className="h-10 w-10 rounded-lg bg-primary-c_light/20">
          <Icon
            as={getReminderIcon(reminder.type)}
            className="h-5 w-5 text-primary-c_light"
          />
        </Avatar>

        <VStack className="flex-1">
          <Text className="font-h4 text-sm font-semibold text-typography-primary">
            {reminder.title}
          </Text>
          <Text className="font-body text-xs text-typography-primary_light">
            {reminder.patientName}
          </Text>
        </VStack>

        <Text className="font-mono text-xs text-typography-primary_light">
          {reminder.dateTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </HStack>
    </Pressable>
  );
};
