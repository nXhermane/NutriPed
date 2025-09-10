# Message

**Fichier Source:** `core/shared/application/Message.ts`

## 1. Vue d'Ensemble

`Message` est une classe simple qui sert à créer des objets de message structurés et typés.

Son but est de standardiser la manière dont les messages (destinés à l'utilisateur final ou à des fins de journalisation) sont représentés dans l'application.

## 2. Définition de la Classe

La classe est très concise et utilise le raccourci de constructeur de TypeScript pour définir ses propriétés.

```typescript
export class Message {
  constructor(
    public type: "info" | "error" | "warning",
    public content: string
  ) {}
}
```

- **`type: "info" | "error" | "warning"`**
  Une propriété publique qui définit la nature du message. L'utilisation d'un type littéral (`"info" | "error" | "warning"`) garantit que seuls ces trois types peuvent être utilisés, ce qui apporte une sécurité de typage. Ce type peut être facilement utilisé par la couche de présentation (UI) pour choisir un style d'affichage approprié (par exemple, une couleur, une icône).

- **`content: string`**
  Une propriété publique qui contient le texte du message.

## 3. Exemple d'Utilisation

La classe `Message` peut être utilisée pour enrichir les réponses des services applicatifs ou des cas d'utilisation, en particulier lorsqu'une opération peut réussir mais avec des avertissements.

Imaginons un cas d'utilisation qui met à jour un patient mais qui veut aussi retourner un message d'information.

```typescript
import { Message } from "@core/shared/application";
import { Result } from "@core/shared/core";

// La réponse pourrait être un Result contenant un Message
type UpdatePatientResponse = Result<Message>;

class UpdatePatientUseCase
  implements UseCase<UpdatePatientDTO, UpdatePatientResponse>
{
  public async execute(
    request: UpdatePatientDTO
  ): Promise<UpdatePatientResponse> {
    // ... logique de mise à jour du patient ...
    // La mise à jour a réussi.

    // On crée un message de succès pour l'utilisateur
    const successMessage = new Message(
      "info",
      `Patient ${request.name} updated successfully.`
    );

    return Result.ok<Message>(successMessage);
  }
}

// Utilisation côté client (UI)
const result = await updatePatientUseCase.execute(dto);

if (result.isSuccess) {
  const message = result.val; // message est une instance de Message

  // L'UI peut utiliser le type pour styliser le message
  showToast(message.content, { style: message.type }); // style: "info"
}
```
