# Configuração do Firebase

## ⚠️ IMPORTANTE: Configuração Necessária

A plataforma está configurada com placeholders para o Firebase. Para funcionar corretamente, você precisa:

## 1. Obter as Configurações Web do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto: `collisionlabs-cb323`
3. Vá em **Project Settings** (ícone de engrenagem)
4. Na aba **General**, role até **Your apps**
5. Se não houver um app web, clique em **Add app** e selecione **Web**
6. Copie o objeto `firebaseConfig`

## 2. Atualizar o Arquivo de Configuração

Edite o arquivo `src/lib/firebase.js` e substitua as configurações:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "collisionlabs-cb323.firebaseapp.com",
  projectId: "collisionlabs-cb323",
  storageBucket: "collisionlabs-cb323.appspot.com",
  messagingSenderId: "SEU_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI"
}
```

## 3. Configurar Firestore Database

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Create database**
3. Escolha **Start in test mode** (para desenvolvimento)
4. Selecione uma localização (recomendado: `southamerica-east1`)

## 4. Configurar Authentication (Opcional)

Se quiser adicionar autenticação:

1. Vá em **Authentication**
2. Clique em **Get started**
3. Na aba **Sign-in method**, habilite os provedores desejados

## 5. Regras de Segurança do Firestore

Para produção, configure regras mais restritivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. Variáveis de Ambiente (Recomendado)

Para maior segurança, use variáveis de ambiente:

1. Crie um arquivo `.env.local`:
```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=collisionlabs-cb323.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=collisionlabs-cb323
VITE_FIREBASE_STORAGE_BUCKET=collisionlabs-cb323.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

2. Atualize `src/lib/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

## 🔍 Como Testar

Após a configuração:

1. Reinicie o servidor de desenvolvimento
2. Acesse a página de Leads
3. Clique em "Novo Lead"
4. Verifique se o lead aparece na lista
5. Verifique no Firebase Console se os dados foram salvos

## ❗ Problemas Comuns

### Erro de CORS
- Verifique se o domínio está autorizado no Firebase Console
- Em Authentication > Settings > Authorized domains

### Erro de Permissão
- Verifique as regras do Firestore
- Para desenvolvimento, use regras permissivas

### Erro de Configuração
- Verifique se todas as chaves estão corretas
- Certifique-se de que o projeto está ativo no Firebase

## 📞 Suporte

Se precisar de ajuda com a configuração:
- Email: contato@collisionlabs.com.br
- Telefone: (16) 99642-1486

