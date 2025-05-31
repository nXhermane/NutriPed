/**
 * Classe utilitaire pour formatter les dates de manière lisible
 * dans une application de santé pédiatrique (français)
 */
export class HumanDateFormatter {
  
  /**
   * Parse une chaîne de date dans différents formats
   * Formats supportés: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, ISO 8601
   */
  private static parseDate(dateStr: string): Date {
    if (!dateStr || typeof dateStr !== 'string') {
      throw new Error('Date invalide : chaîne vide ou non valide');
    }

    const trimmed = dateStr.trim();
    
    // Format ISO 8601 (avec ou sans heure)
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)) {
      const date = new Date(trimmed);
      if (isNaN(date.getTime())) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }
    
    // Format DD/MM/YYYY ou DD/MM/YYYY HH:MM
    const ddmmMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(\s+(\d{1,2}):(\d{2}))?/);
    if (ddmmMatch) {
      const day = parseInt(ddmmMatch[1], 10);
      const month = parseInt(ddmmMatch[2], 10);
      const year = parseInt(ddmmMatch[3], 10);
      const hour = ddmmMatch[5] ? parseInt(ddmmMatch[5], 10) : 0;
      const minute = ddmmMatch[6] ? parseInt(ddmmMatch[6], 10) : 0;
      
      const date = new Date(year, month - 1, day, hour, minute);
      if (isNaN(date.getTime()) || date.getFullYear() !== year || 
          date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }
    
    // Format MM/DD/YYYY ou MM/DD/YYYY HH:MM
    const mmddMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(\s+(\d{1,2}):(\d{2}))?/);
    if (mmddMatch) {
      const month = parseInt(mmddMatch[1], 10);
      const day = parseInt(mmddMatch[2], 10);
      const year = parseInt(mmddMatch[3], 10);
      const hour = mmddMatch[5] ? parseInt(mmddMatch[5], 10) : 0;
      const minute = mmddMatch[6] ? parseInt(mmddMatch[6], 10) : 0;
      
      // Vérification basique pour distinguer MM/DD de DD/MM
      // Si le premier nombre > 12, c'est probablement DD/MM
      if (month > 12 && day <= 12) {
        const date = new Date(year, day - 1, month, hour, minute);
        if (isNaN(date.getTime())) {
          throw new Error(`Date invalide : ${dateStr}`);
        }
        return date;
      }
      
      const date = new Date(year, month - 1, day, hour, minute);
      if (isNaN(date.getTime()) || date.getFullYear() !== year || 
          date.getMonth() !== month - 1 || date.getDate() !== day) {
        throw new Error(`Date invalide : ${dateStr}`);
      }
      return date;
    }
    
    throw new Error(`Format de date non supporté : ${dateStr}`);
  }

  /**
   * Calcule l'âge pédiatrique approprié selon les conventions médicales
   */
  static toAge(birthDateString: string): string {
    try {
      const birthDate = this.parseDate(birthDateString);
      const now = new Date();
      
      if (birthDate > now) {
        throw new Error('La date de naissance ne peut pas être dans le futur');
      }

      const diffMs = now.getTime() - birthDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      // < 1 mois : en jours
      if (diffDays < 30) {
        return diffDays === 0 ? "aujourd'hui" : 
               diffDays === 1 ? "1 jour" : `${diffDays} jours`;
      }
      
      // < 2 mois : en semaines
      if (diffDays < 60) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? "1 semaine" : `${weeks} semaines`;
      }
      
      // < 5 ans : en mois
      const diffMonths = this.getMonthsDifference(birthDate, now);
      if (diffMonths < 60) {
        return diffMonths === 1 ? "1 mois" : `${diffMonths} mois`;
      }
      
      // ≥ 5 ans : en années
      const years = Math.floor(diffMonths / 12);
      return years === 1 ? "1 an" : `${years} ans`;
      
    } catch (error:unknown) {
      throw new Error(`Erreur lors du calcul de l'âge : ${error}`);
    }
  }

  /**
   * Calcule la différence en mois entre deux dates
   */
  private static getMonthsDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    
    let months = (endYear - startYear) * 12 + (endMonth - startMonth);
    
    // Ajustement si le jour du mois de fin est antérieur au jour de début
    if (endDate.getDate() < startDate.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  }

  /**
   * Formate une date en format relatif (aujourd'hui, demain, dans X jours, etc.)
   */
  static toRelativeDate(targetDateString: string, withTime: boolean = true): string {
    try {
      const targetDate = this.parseDate(targetDateString);
      const now = new Date();
      
      // Normaliser les dates pour la comparaison (sans heure)
      const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffMs = targetDay.getTime() - today.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      const timeStr = withTime ? this.formatTime(targetDate) : '';
      
      // Aujourd'hui
      if (diffDays === 0) {
        return withTime && timeStr ? `Aujourd'hui à ${timeStr}` : "Aujourd'hui";
      }
      
      // Demain
      if (diffDays === 1) {
        return withTime && timeStr ? `Demain à ${timeStr}` : "Demain";
      }
      
      // Hier
      if (diffDays === -1) {
        return withTime && timeStr ? `Hier à ${timeStr}` : "Hier";
      }
      
      // Cette semaine (2-6 jours)
      if (diffDays > 1 && diffDays <= 6) {
        return `Dans ${diffDays} jours`;
      }
      
      if (diffDays < -1 && diffDays >= -6) {
        return `Il y a ${Math.abs(diffDays)} jours`;
      }
      
      // Semaines
      if (diffDays === 7) {
        return "Dans 1 semaine";
      }
      
      if (diffDays === -7) {
        return "Il y a 1 semaine";
      }
      
      if (diffDays > 7 && diffDays <= 21) {
        const weeks = Math.round(diffDays / 7);
        return `Dans ${weeks} semaines`;
      }
      
      if (diffDays < -7 && diffDays >= -21) {
        const weeks = Math.round(Math.abs(diffDays) / 7);
        return `Il y a ${weeks} semaines`;
      }
      
      // Date complète pour les dates éloignées
      return this.formatLongDate(targetDate);
      
    } catch (error: unknown) {
      throw new Error(`Erreur lors du formatage de la date relative : ${error}`);
    }
  }

  /**
   * Formate l'heure au format français (9h, 14h30)
   */
  private static formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    if (hours === 0 && minutes === 0) {
      return ''; // Pas d'heure spécifiée
    }
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Formate une date complète au format français
   */
  private static formatLongDate(date: Date): string {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `le ${day}/${(date.getMonth()+1).toString().padStart(2,"0")}/${year}`;
  }

  /**
   * Formate la durée depuis le début du suivi
   */
  static toFollowUpDate(sinceDateString: string): string {
    try {
      const sinceDate = this.parseDate(sinceDateString);
      const now = new Date();
      
      if (sinceDate > now) {
        throw new Error('La date de début de suivi ne peut pas être dans le futur');
      }
      
      // Normaliser les dates pour la comparaison (sans heure)
      const sinceDay = new Date(sinceDate.getFullYear(), sinceDate.getMonth(), sinceDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffMs = today.getTime() - sinceDay.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      
      // Aujourd'hui
      if (diffDays === 0) {
        return "Suivi depuis aujourd'hui";
      }
      
      // Hier
      if (diffDays === 1) {
        return "Suivi depuis hier";
      }
      
      // Cette semaine (2-6 jours)
      if (diffDays >= 2 && diffDays <= 6) {
        return `Suivi depuis ${diffDays} jours`;
      }
      
      // La semaine dernière
      if (diffDays === 7) {
        return "Suivi depuis la semaine dernière";
      }
      
      // Semaines récentes (8-21 jours)
      if (diffDays >= 8 && diffDays <= 21) {
        const weeks = Math.round(diffDays / 7);
        return `Suivi depuis ${weeks} semaines`;
      }
      
      // Date complète pour les suivis plus anciens
      const day = sinceDate.getDate().toString().padStart(2, '0');
      const month = (sinceDate.getMonth() + 1).toString().padStart(2, '0');
      const year = sinceDate.getFullYear();
      
      return `Suivi depuis le ${day}/${month}/${year}`;
      
    } catch (error) {
      throw new Error(`Erreur lors du formatage de la date de suivi : ${error}`);
    }
  }
}