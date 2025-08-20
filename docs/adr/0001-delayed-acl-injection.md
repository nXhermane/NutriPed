# 0001 - Injection différée des ACLs

Date: 2025-08-06  
Statut: Accepté (temporaire)

## Contexte

L’initialisation du MedicalRecordContext dépend de services du DiagnosticContext.  
Mais ce dernier a aussi besoin du MedicalRecordContext → dépendance circulaire.

## Décision

Créer MedicalRecordContext **sans ACLs** → puis injecter via `setAcls()` après la création.

## Conséquences

- Plus de dépendance circulaire
- Mais complexité dans le cycle de vie
- Risque d’oublier d’injecter les ACLs

## Alternatives envisagées

- Utiliser un proxy `MedicalRecordACLProxy`
- Passer à une architecture IoC avec injection inversée

## Prochaines actions

- Implémenter un proxy ACL pour comparer les deux méthodes
