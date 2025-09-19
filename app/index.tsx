import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useGoogleAuth } from "@/src/context";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";

export default function Index() {
  const { login, logout, revokeAccess, isAuthenticated, user, onLoading, loginLoading, logoutLoading, revokeLoading } = useGoogleAuth();

  return (
    <VStack className="flex-1 justify-center items-center p-6 bg-background-primary">
      <Text className="text-2xl font-bold text-typography-primary mb-8">
        Authentification Google
      </Text>

      {/* Affichage du statut de connexion */}
      <Box className="mb-6 p-4 bg-background-secondary rounded-lg w-full max-w-sm">
        <Text className="text-sm text-typography-secondary mb-2">Statut :</Text>
        <Text className={`text-base font-medium ${user ? 'text-green-600' : 'text-red-600'}`}>
          {user ? 'Connecté' : 'Non connecté'}
        </Text>
      </Box>

      {/* Affichage des informations utilisateur */}
      {user && (
        <Box className="mb-6 p-4 bg-background-secondary rounded-lg w-full max-w-sm">
          <Text className="text-sm text-typography-secondary mb-2">Utilisateur :</Text>
          <Text className="text-sm text-typography-primary">{user.email}</Text>
          <Text className="text-sm text-typography-primary">{user.name}</Text>
        </Box>
      )}

      {/* Boutons d'action */}
      <VStack className="w-full max-w-sm space-y-4">
        {!user ? (
          // Bouton de connexion
          <Button
            className="bg-blue-600 hover:bg-blue-700 rounded-xl py-3"
            onPress={() => login()}
            disabled={onLoading}
          >
            <HStack className="items-center space-x-2">
              {onLoading && <Spinner size="small" className="text-white" />}
              <ButtonText className="text-white font-medium">
                {onLoading ? 'Connexion...' : 'Se connecter avec Google'}
              </ButtonText>
            </HStack>
          </Button>
        ) : (
          // Boutons de déconnexion et révocation
          <VStack className="space-y-3">
            <Button
              className="bg-green-600 hover:bg-green-700 rounded-xl py-3"
              onPress={() => logout()}
              disabled={onLoading}
            >
              <HStack className="items-center space-x-2">
                {onLoading && <Spinner size="small" className="text-white" />}
                <ButtonText className="text-white font-medium">
                  {onLoading ? 'Déconnexion...' : 'Se déconnecter'}
                </ButtonText>
              </HStack>
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 rounded-xl py-3"
              onPress={() => revokeAccess()}
              disabled={onLoading}
            >
              <HStack className="items-center space-x-2">
                {onLoading && <Spinner size="small" className="text-white" />}
                <ButtonText className="text-white font-medium">
                  {onLoading ? 'Révocation...' : 'Révoquer l\'accès'}
                </ButtonText>
              </HStack>
            </Button>
          </VStack>
        )}
      </VStack>

      {/* Indicateur de chargement global */}
      {onLoading && (
        <Box className="mt-6 p-3 bg-background-secondary rounded-lg">
          <HStack className="items-center space-x-2">
            <Spinner size="small" />
            <Text className="text-sm text-typography-secondary">Traitement en cours...</Text>
          </HStack>
        </Box>
      )}
    </VStack>
  );
}
