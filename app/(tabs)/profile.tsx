import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Award,
  Calendar,
  FileText
} from "lucide-react-native";

export default function ProfileTab() {
  const menuItems = [
    {
      icon: Edit,
      title: 'Modifier le profil',
      subtitle: 'Informations personnelles',
      action: 'edit'
    },
    {
      icon: Settings,
      title: 'Paramètres',
      subtitle: 'Préférences et configuration',
      action: 'settings'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Gérer les alertes',
      action: 'notifications'
    },
    {
      icon: Shield,
      title: 'Confidentialité',
      subtitle: 'Sécurité et données',
      action: 'privacy'
    },
    {
      icon: FileText,
      title: 'Rapports',
      subtitle: 'Historique et statistiques',
      action: 'reports'
    },
    {
      icon: HelpCircle,
      title: 'Aide & Support',
      subtitle: 'FAQ et contact',
      action: 'help'
    }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack space="md" className="p-4">
        {/* Profile Header */}
        <Card className="p-6 bg-white rounded-lg shadow-sm">
          <VStack space="md" className="items-center">
            <Avatar size="xl">
              <AvatarFallbackText className="text-2xl">DM</AvatarFallbackText>
            </Avatar>

            <VStack space="sm" className="items-center">
              <Heading size="lg" className="text-gray-900">
                Dr. Martin Dubois
              </Heading>
              <Text className="text-gray-600 text-center">
                Pédiatre - Hôpital Saint-Joseph
              </Text>
              <Badge className="bg-blue-100 text-blue-800 mt-2">
                <Text className="text-xs">Membre depuis 2018</Text>
              </Badge>
            </VStack>

            <Button variant="outline" className="mt-4 w-full">
              <ButtonText>Modifier le profil</ButtonText>
            </Button>
          </VStack>
        </Card>

        {/* Stats */}
        <HStack space="md">
          <Card className="flex-1 p-4 bg-white rounded-lg shadow-sm">
            <VStack space="sm" className="items-center">
              <Award size={24} color="#3B82F6" />
              <Text className="text-xl font-bold text-gray-900">156</Text>
              <Text className="text-xs text-gray-600 text-center">Patients soignés</Text>
            </VStack>
          </Card>

          <Card className="flex-1 p-4 bg-white rounded-lg shadow-sm">
            <VStack space="sm" className="items-center">
              <Calendar size={24} color="#10B981" />
              <Text className="text-xl font-bold text-gray-900">2,340</Text>
              <Text className="text-xs text-gray-600 text-center">Consultations</Text>
            </VStack>
          </Card>

          <Card className="flex-1 p-4 bg-white rounded-lg shadow-sm">
            <VStack space="sm" className="items-center">
              <FileText size={24} color="#F59E0B" />
              <Text className="text-xl font-bold text-gray-900">89</Text>
              <Text className="text-xs text-gray-600 text-center">Rapports</Text>
            </VStack>
          </Card>
        </HStack>

        {/* Menu Items */}
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <VStack space="sm">
            <Heading size="md" className="text-gray-900 mb-2">
              Paramètres du compte
            </Heading>

            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Box key={item.action}>
                  <HStack
                    space="md"
                    className="items-center p-3 rounded-lg active:bg-gray-50"
                  >
                    <Box className="p-2 bg-blue-50 rounded-lg">
                      <IconComponent size={20} color="#3B82F6" />
                    </Box>

                    <VStack className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {item.subtitle}
                      </Text>
                    </VStack>
                  </HStack>

                  {index < menuItems.length - 1 && (
                    <Divider className="my-2" />
                  )}
                </Box>
              );
            })}
          </VStack>
        </Card>

        {/* App Info */}
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <VStack space="sm">
            <Heading size="md" className="text-gray-900">
              À propos de MalNutrix
            </Heading>

            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-gray-600">Version</Text>
                <Text className="text-gray-900">1.0.0</Text>
              </HStack>

              <HStack className="justify-between">
                <Text className="text-gray-600">Dernière mise à jour</Text>
                <Text className="text-gray-900">20/09/2025</Text>
              </HStack>

              <HStack className="justify-between">
                <Text className="text-gray-600">Licence</Text>
                <Text className="text-gray-900">Professionnel</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Logout Button */}
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <Button variant="outline" className="w-full border-red-200">
            <HStack space="sm" className="items-center">
              <LogOut size={20} color="#EF4444" />
              <ButtonText className="text-red-600">Se déconnecter</ButtonText>
            </HStack>
          </Button>
        </Card>
      </VStack>
    </ScrollView>
  );
}
