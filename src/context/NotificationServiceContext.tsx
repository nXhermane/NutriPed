import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import NotificationService, {
  NotificationType,
  ProgressNotificationData,
  SystemNotificationData,
} from "@/adapter/services/Notification/NotificationService";

export interface NotificationServiceContextType {
  // Progress notifications
  notifyDownloadStart: (filename: string) => Promise<void>;
  notifyDownloadProgress: (filename: string, progress: number, speed?: string) => Promise<void>;
  notifyDownloadComplete: (filename: string) => Promise<void>;

  notifyTaskStart: (taskName: string) => Promise<void>;
  notifyTaskProgress: (taskName: string, progress: number) => Promise<void>;
  notifyTaskComplete: (taskName: string, success?: boolean) => Promise<void>;

  // Indeterminate progress (loading without percentage)
  notifyIndeterminateProgress: (id: string, title: string, message: string, type?: NotificationType) => Promise<void>;

  // Medical notifications
  notifyPatientAdded: (patientName: string) => Promise<void>;
  notifyMedicalAlert: (patientName: string, alertType: string) => Promise<void>;
  notifyEvaluationComplete: (patientName: string, evaluationType: string) => Promise<void>;

  // System notifications
  notifyUpdateAvailable: (version: string) => Promise<void>;
  notifyDataSync: (status: 'started' | 'completed' | 'error', details?: string) => Promise<void>;
  notifyBackupComplete: (success?: boolean) => Promise<void>;

  // Generic notifications
  showProgressNotification: (id: string, title: string, data: ProgressNotificationData, type?: NotificationType) => Promise<void>;
  showSystemNotification: (data: SystemNotificationData) => Promise<void>;

  // Management
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

const NotificationServiceContext = createContext<NotificationServiceContextType | null>(null);

export interface NotificationServiceProviderProps {
  children: ReactNode;
}

export const NotificationServiceProvider: FC<NotificationServiceProviderProps> = ({
  children,
}) => {
  const notificationService = useMemo(
    () => NotificationService.getInstance(),
    []
  );

  const contextValue: NotificationServiceContextType = useMemo(() => ({
    // Progress notifications
    notifyDownloadStart: (filename: string) => notificationService.notifyDownloadStart(filename),
    notifyDownloadProgress: (filename: string, progress: number, speed?: string) =>
      notificationService.notifyDownloadProgress(filename, progress, speed),
    notifyDownloadComplete: (filename: string) => notificationService.notifyDownloadComplete(filename),

    notifyTaskStart: (taskName: string) => notificationService.notifyTaskStart(taskName),
    notifyTaskProgress: (taskName: string, progress: number) => notificationService.notifyTaskProgress(taskName, progress),
    notifyTaskComplete: (taskName: string, success = true) => notificationService.notifyTaskComplete(taskName, success),

    // Indeterminate progress
    notifyIndeterminateProgress: async (id: string, title: string, message: string, type = NotificationType.TASK_PROGRESS) => {
      await notificationService.showProgressNotification(id, title, { progress: -1, message }, type);
    },

    // Medical notifications
    notifyPatientAdded: (patientName: string) => notificationService.notifyPatientAdded(patientName),
    notifyMedicalAlert: (patientName: string, alertType: string) => notificationService.notifyMedicalAlert(patientName, alertType),
    notifyEvaluationComplete: (patientName: string, evaluationType: string) =>
      notificationService.notifyEvaluationComplete(patientName, evaluationType),

    // System notifications
    notifyUpdateAvailable: (version: string) => notificationService.notifyUpdateAvailable(version),
    notifyDataSync: (status, details) => notificationService.notifyDataSync(status, details),
    notifyBackupComplete: (success = true) => notificationService.notifyBackupComplete(success),

    // Generic methods
    showProgressNotification: (id, title, data, type) => notificationService.showProgressNotification(id, title, data, type),
    showSystemNotification: (data) => notificationService.showSystemNotification(data),

    // Management
    cancelNotification: (id) => notificationService.cancelNotification(id),
    cancelAllNotifications: () => notificationService.cancelAllNotifications(),
  }), [notificationService]);

  return (
    <NotificationServiceContext.Provider value={contextValue}>
      {children}
    </NotificationServiceContext.Provider>
  );
};

export function useNotificationService() {
  const context = useContext(NotificationServiceContext);
  if (!context) {
    throw new Error(
      "useNotificationService doit être utilisé dans un NotificationServiceProvider"
    );
  }
  return context;
}

// Hooks spécialisés pour faciliter l'usage
export function useDownloadNotifications() {
  const { notifyDownloadStart, notifyDownloadProgress, notifyDownloadComplete } = useNotificationService();

  return {
    startDownload: notifyDownloadStart,
    updateProgress: notifyDownloadProgress,
    completeDownload: notifyDownloadComplete,
  };
}

export function useTaskNotifications() {
  const { notifyTaskStart, notifyTaskProgress, notifyTaskComplete } = useNotificationService();

  return {
    startTask: notifyTaskStart,
    updateProgress: notifyTaskProgress,
    completeTask: notifyTaskComplete,
  };
}

export function useMedicalNotifications() {
  const { notifyPatientAdded, notifyMedicalAlert, notifyEvaluationComplete } = useNotificationService();

  return {
    patientAdded: notifyPatientAdded,
    medicalAlert: notifyMedicalAlert,
    evaluationComplete: notifyEvaluationComplete,
  };
}

export function useSystemNotifications() {
  const { notifyUpdateAvailable, notifyDataSync, notifyBackupComplete } = useNotificationService();

  return {
    updateAvailable: notifyUpdateAvailable,
    dataSync: notifyDataSync,
    backupComplete: notifyBackupComplete,
  };
}

// Hooks avancés avec callbacks pour une utilisation simplifiée
export function useDownloadWithProgress() {
  const { showProgressNotification, showSystemNotification, cancelNotification } = useNotificationService();

  const startDownload = async (
    filename: string,
    onProgress?: (progress: number, speed?: string) => void,
    onComplete?: () => void
  ) => {
    const notificationId = `download_${filename}`;

    // Démarrage
    await showProgressNotification(
      notificationId,
      `Téléchargement: ${filename}`,
      { progress: 0, message: "Démarrage du téléchargement..." },
      NotificationType.DOWNLOAD_PROGRESS
    );

    return {
      // Fonction pour mettre à jour la progression
      updateProgress: async (progress: number, speed?: string) => {
        const message = speed ? `${progress}% - ${speed}` : `${progress}%`;
        await showProgressNotification(
          notificationId,
          `Téléchargement: ${filename}`,
          { progress, message },
          NotificationType.DOWNLOAD_PROGRESS
        );
        onProgress?.(progress, speed);
      },

      // Fonction pour terminer
      complete: async (successMessage?: string) => {
        // Afficher brièvement le message de succès puis disparaître
        await showProgressNotification(
          notificationId,
          `Téléchargement: ${filename}`,
          { progress: 100, message: successMessage || "Téléchargement terminé !" },
          NotificationType.DOWNLOAD_PROGRESS
        );

        // Disparaître immédiatement après un court délai
        setTimeout(() => cancelNotification(notificationId), 500);

        onComplete?.();
      },

      // Fonction pour annuler
      cancel: async () => {
        await cancelNotification(notificationId);
      }
    };
  };

  return { startDownload };
}

export function useIndeterminateLoader() {
  const { showProgressNotification, showSystemNotification, cancelNotification } = useNotificationService();

  const startIndeterminate = async (
    id: string,
    title: string,
    loadingMessage: string,
    type: NotificationType = NotificationType.TASK_PROGRESS,
    onComplete?: () => void
  ) => {
    // Démarrage du loader indéterminé
    await showProgressNotification(
      id,
      title,
      { progress: -1, message: loadingMessage },
      type
    );

    return {
      // Fonction pour terminer avec succès
      complete: async (successTitle?: string, successMessage?: string) => {
        // Créer notification de succès
        await showSystemNotification({
          title: successTitle || `${title} terminée`,
          message: successMessage || "Opération réalisée avec succès",
          type,
        });

        // Cacher le loader indéterminé
        await cancelNotification(id);

        onComplete?.();
      },

      // Fonction pour terminer avec erreur
      error: async (errorTitle?: string, errorMessage?: string) => {
        // Créer notification d'erreur
        await showSystemNotification({
          title: errorTitle || `Erreur ${title.toLowerCase()}`,
          message: errorMessage || "Une erreur s'est produite",
          type: NotificationType.ERROR_ALERT,
        });

        // Cacher le loader indéterminé
        await cancelNotification(id);

        onComplete?.();
      },

      // Fonction pour annuler
      cancel: async () => {
        await cancelNotification(id);
      }
    };
  };

  return { startIndeterminate };
}

export function useTaskWithProgress() {
  const { showProgressNotification, showSystemNotification, cancelNotification } = useNotificationService();

  const startTask = async (
    taskName: string,
    onProgress?: (progress: number) => void,
    onComplete?: (success: boolean) => void
  ) => {
    const notificationId = `task_${taskName}`;

    // Démarrage
    await showProgressNotification(
      notificationId,
      `Tâche: ${taskName}`,
      { progress: 0, message: "Démarrage de la tâche..." },
      NotificationType.TASK_PROGRESS
    );

    return {
      // Fonction pour mettre à jour la progression
      updateProgress: async (progress: number, message?: string) => {
        await showProgressNotification(
          notificationId,
          `Tâche: ${taskName}`,
          { progress, message: message || `${progress}% terminé` },
          NotificationType.TASK_PROGRESS
        );
        onProgress?.(progress);
      },

      // Fonction pour terminer
      complete: async (success = true, finalMessage?: string) => {
        await showSystemNotification({
          title: success ? "Tâche terminée" : "Erreur de tâche",
          message: finalMessage || (success
            ? `${taskName} s'est terminé avec succès`
            : `Erreur lors de l'exécution de ${taskName}`),
          type: success ? NotificationType.TASK_PROGRESS : NotificationType.ERROR_ALERT,
        });

        // Cacher la notification de progression
        await cancelNotification(notificationId);

        onComplete?.(success);
      },

      // Fonction pour annuler
      cancel: async () => {
        await cancelNotification(notificationId);
      }
    };
  };

  return { startTask };
}
