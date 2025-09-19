import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { NOTIFICATION_CONFIG } from '@/adapter/config/notification/config';

export enum NotificationType {
  // System notifications
  DOWNLOAD_PROGRESS = 'download_progress',
  TASK_PROGRESS = 'task_progress',
  SYSTEM_UPDATE = 'system_update',
  DATA_SYNC = 'data_sync',

  // Medical/Patient notifications
  PATIENT_ADDED = 'patient_added',
  MEDICAL_ALERT = 'medical_alert',
  EVALUATION_COMPLETE = 'evaluation_complete',
  CRITICAL_VALUES = 'critical_values',

  // App specific
  BACKUP_COMPLETE = 'backup_complete',
  IMPORT_COMPLETE = 'import_complete',
  ERROR_ALERT = 'error_alert',
}

export interface ProgressNotificationData {
  progress: number; // 0-100
  total?: number;
  current?: number;
  message?: string;
}

export interface SystemNotificationData {
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  title: string;
  actionId: string;
  requiresInput?: boolean;
  inputPlaceholder?: string;
  inputChoices?: string[];
}

export default class NotificationService {
  private static instance: NotificationService;
  private channelCreated = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async ensureChannelCreated() {
    if (!this.channelCreated) {
      try {
        await notifee.createChannel(NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL);
        this.channelCreated = true;
      } catch (error) {
        this.channelCreated = true; // Might already exist
      }
    }
  }

  // Progress notifications (download, task progress, etc.) - UNE SEULE notification qui se met à jour
  async showProgressNotification(
    id: string,
    title: string,
    data: ProgressNotificationData,
    type: NotificationType = NotificationType.DOWNLOAD_PROGRESS
  ): Promise<void> {
    await this.ensureChannelCreated();

    // Pour les progressions indéterminées (chargement sans pourcentage)
    const isIndeterminate = data.progress < 0 || data.progress === undefined || data.progress === null;

    const progress = isIndeterminate ? 0 : Math.max(0, Math.min(100, data.progress));
    const message = data.message || this.getProgressMessage(type, progress, data);

    // Style personnalisé selon le type
    const style = this.getProgressStyle(type);

    await notifee.displayNotification({
      id,
      title,
      body: message,
      android: {
        channelId: NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL.id,
        importance: AndroidImportance.LOW,
        visibility: AndroidVisibility.PUBLIC,
        progress: isIndeterminate ? {
          max: 100,
          current: 0,
          indeterminate: true,
        } : {
          max: 100,
          current: progress,
        },
        smallIcon: style.smallIcon,
        largeIcon: style.largeIcon,
        color: style.color,
      },
      data: {
        type,
        notificationProgress: progress,
        ...data,
      },
    });
  }

  // System notifications (updates, alerts, events)
  async showSystemNotification(data: SystemNotificationData): Promise<void> {
    await this.ensureChannelCreated();

    const actions = data.actions?.map(action => ({
      title: action.title,
      pressAction: {
        id: action.actionId,
      },
      ...(action.requiresInput && {
        input: {
          placeholder: action.inputPlaceholder || 'Enter value',
          allowFreeFormInput: !action.inputChoices,
          choices: action.inputChoices,
        },
      }),
    }));

    await notifee.displayNotification({
      id: `${data.type}_${Date.now()}`,
      title: data.title,
      body: data.message,
      android: {
        channelId: NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL.id,
        importance: this.getImportanceForType(data.type),
        visibility: AndroidVisibility.PUBLIC,
        pressAction: {
          id: 'default',
        },
        actions,
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
      },
      data: {
        type: data.type,
        ...data.data,
      },
    });
  }

  // Quick notification methods for common use cases
  async notifyDownloadStart(filename: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Téléchargement démarré',
      message: `Téléchargement de ${filename} en cours...`,
      type: NotificationType.DOWNLOAD_PROGRESS,
    });
  }

  async notifyDownloadProgress(filename: string, progress: number, speed?: string): Promise<void> {
    const message = speed ? `${progress}% - ${speed}` : `${progress}%`;
    await this.showProgressNotification(
      `download_${filename}`,
      `Téléchargement: ${filename}`,
      { progress, message },
      NotificationType.DOWNLOAD_PROGRESS
    );
  }

  async notifyDownloadComplete(filename: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Téléchargement terminé',
      message: `${filename} a été téléchargé avec succès`,
      type: NotificationType.DOWNLOAD_PROGRESS,
    });
  }

  async notifyTaskStart(taskName: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Tâche démarrée',
      message: `${taskName} en cours d'exécution...`,
      type: NotificationType.TASK_PROGRESS,
    });
  }

  async notifyTaskProgress(taskName: string, progress: number): Promise<void> {
    await this.showProgressNotification(
      `task_${taskName}`,
      `Tâche: ${taskName}`,
      { progress },
      NotificationType.TASK_PROGRESS
    );
  }

  async notifyTaskComplete(taskName: string, success = true): Promise<void> {
    await this.showSystemNotification({
      title: success ? 'Tâche terminée' : 'Erreur de tâche',
      message: success
        ? `${taskName} s'est terminé avec succès`
        : `Erreur lors de l'exécution de ${taskName}`,
      type: success ? NotificationType.TASK_PROGRESS : NotificationType.ERROR_ALERT,
    });
  }

  async notifyPatientAdded(patientName: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Nouveau patient ajouté',
      message: `${patientName} a été ajouté à votre liste de patients`,
      type: NotificationType.PATIENT_ADDED,
      actions: [
        {
          title: 'Voir patient',
          actionId: 'view_patient',
        },
      ],
    });
  }

  async notifyMedicalAlert(patientName: string, alertType: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Alerte médicale',
      message: `Alerte ${alertType} pour le patient ${patientName}`,
      type: NotificationType.MEDICAL_ALERT,
      actions: [
        {
          title: 'Voir détails',
          actionId: 'view_alert',
        },
      ],
    });
  }

  async notifyEvaluationComplete(patientName: string, evaluationType: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Évaluation terminée',
      message: `Évaluation ${evaluationType} complétée pour ${patientName}`,
      type: NotificationType.EVALUATION_COMPLETE,
      actions: [
        {
          title: 'Voir résultats',
          actionId: 'view_results',
        },
      ],
    });
  }

  async notifyUpdateAvailable(version: string): Promise<void> {
    await this.showSystemNotification({
      title: 'Mise à jour disponible',
      message: `Nouvelle version ${version} disponible`,
      type: NotificationType.SYSTEM_UPDATE,
      actions: [
        {
          title: 'Mettre à jour',
          actionId: 'update_app',
        },
        {
          title: 'Plus tard',
          actionId: 'dismiss',
        },
      ],
    });
  }

  async notifyDataSync(status: 'started' | 'completed' | 'error', details?: string): Promise<void> {
    const messages = {
      started: 'Synchronisation des données en cours...',
      completed: 'Synchronisation terminée avec succès',
      error: `Erreur de synchronisation${details ? `: ${details}` : ''}`,
    };

    await this.showSystemNotification({
      title: 'Synchronisation',
      message: messages[status],
      type: status === 'error' ? NotificationType.ERROR_ALERT : NotificationType.DATA_SYNC,
    });
  }

  async notifyBackupComplete(success = true): Promise<void> {
    await this.showSystemNotification({
      title: success ? 'Sauvegarde terminée' : 'Erreur de sauvegarde',
      message: success
        ? 'Vos données ont été sauvegardées avec succès'
        : 'Erreur lors de la sauvegarde des données',
      type: success ? NotificationType.BACKUP_COMPLETE : NotificationType.ERROR_ALERT,
    });
  }

  // Utility methods
  private getProgressMessage(type: NotificationType, progress: number, data: ProgressNotificationData): string {
    switch (type) {
      case NotificationType.DOWNLOAD_PROGRESS:
        return `${progress}% - ${data.current || 0}MB / ${data.total || 0}MB`;
      case NotificationType.TASK_PROGRESS:
        return `${progress}% terminé`;
      default:
        return `${progress}%`;
    }
  }

  private getProgressStyle(type: NotificationType): { smallIcon: string; largeIcon: string; color?: string } {
    switch (type) {
      case NotificationType.DOWNLOAD_PROGRESS:
        return {
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
          color: '#3B82F6', // Blue for downloads
        };
      case NotificationType.TASK_PROGRESS:
        return {
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
          color: '#10B981', // Green for tasks
        };
      default:
        return {
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
        };
    }
  }

  private getImportanceForType(type: NotificationType): AndroidImportance {
    switch (type) {
      case NotificationType.MEDICAL_ALERT:
      case NotificationType.CRITICAL_VALUES:
      case NotificationType.ERROR_ALERT:
        return AndroidImportance.HIGH;
      case NotificationType.SYSTEM_UPDATE:
      case NotificationType.PATIENT_ADDED:
        return AndroidImportance.DEFAULT;
      default:
        return AndroidImportance.LOW;
    }
  }

  // Cancel specific notification
  async cancelNotification(id: string): Promise<void> {
    await notifee.cancelDisplayedNotification(id);
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await notifee.cancelAllNotifications();
  }
}
