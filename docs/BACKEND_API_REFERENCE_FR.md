# BH66 Tailoring API - Référence des Endpoints

Version : `1.0.0`

Généré depuis `docs/backend_openapi.json`.

Note: les noms techniques (`schemas`, `fields`, `enum values`) sont conservés tels quels pour un mapping frontend exact.

## Endpoints

### `POST /api/auth/login`

**Résumé :** Login User

**Tags :** auth

**OperationId :** `users_api_routes_login_user`

**Auth :** Aucune

**Request Body**

Required: **yes**

- `application/json` -> `UserLoginIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TokenOut` |

---

### `POST /api/auth/logout`

**Résumé :** Logout User

**Tags :** auth

**OperationId :** `users_api_routes_logout_user`

**Auth :** Aucune

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | - | - |

---

### `POST /api/auth/refresh`

**Résumé :** Refresh Token

**Tags :** auth

**OperationId :** `users_api_routes_refresh_token`

**Auth :** Aucune

**Request Body**

Required: **no**

Le refresh token est lu depuis le cookie HttpOnly `bh66_refresh_token`.

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TokenOut` |

---

### `POST /api/auth/register`

**Résumé :** Register User

**Tags :** auth

**OperationId :** `users_api_routes_register_user`

**Auth :** Aucune

**Request Body**

Required: **yes**

- `application/json` -> `UserCreateIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `GET /api/notifications`

**Résumé :** List Notifications

**Tags :** notifications

**OperationId :** `notifications_api_routes_list_notifications`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[NotificationOut]` |

---

### `PATCH /api/notifications/{notification_id}/read`

**Résumé :** Mark Notification Read

**Tags :** notifications

**OperationId :** `notifications_api_routes_mark_notification_read`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `notification_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `NotificationMarkReadOut` |

---

### `GET /api/orders`

**Résumé :** List Orders

**Tags :** orders

**OperationId :** `orders_api_routes_list_orders`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[OrderOut]` |

---

### `POST /api/orders`

**Résumé :** Create Order Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_create_order_endpoint`

**Auth :** Requise

**Request Body**

Required: **yes**

- `application/json` -> `OrderCreateIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `GET /api/orders/catalog-models`

**Résumé :** List Tailor Models

**Tags :** orders

**OperationId :** `orders_api_routes_list_tailor_models`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[TailorModelOut]` |

---

### `POST /api/orders/catalog-models`

**Résumé :** Create Tailor Model Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_create_tailor_model_endpoint`

**Auth :** Requise

**Request Body**

Required: **yes**

- `multipart/form-data` -> `object`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `GET /api/orders/catalog-models/{model_id}`

**Résumé :** Get Tailor Model

**Tags :** orders

**OperationId :** `orders_api_routes_get_tailor_model`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `model_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `PATCH /api/orders/catalog-models/{model_id}`

**Résumé :** Patch Tailor Model Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_patch_tailor_model_endpoint`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `model_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**

- `application/json` -> `TailorModelPatchIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `GET /api/orders/promotions`

**Résumé :** List Promotions

**Tags :** orders

**OperationId :** `orders_api_routes_list_promotions`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[PromotionOut]` |

---

### `POST /api/orders/promotions`

**Résumé :** Create Promotion Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_create_promotion_endpoint`

**Auth :** Requise

**Request Body**

Required: **yes**

- `application/json` -> `PromotionIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `PromotionOut` |

---

### `PATCH /api/orders/promotions/{promotion_id}`

**Résumé :** Patch Promotion Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_patch_promotion_endpoint`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `promotion_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**

- `application/json` -> `PromotionPatchIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `PromotionOut` |

---

### `GET /api/orders/{order_id}`

**Résumé :** Get Order

**Tags :** orders

**OperationId :** `orders_api_routes_get_order`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `order_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `PATCH /api/orders/{order_id}`

**Résumé :** Patch Order Endpoint

**Tags :** orders

**OperationId :** `orders_api_routes_patch_order_endpoint`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `order_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**

- `application/json` -> `OrderPatchIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `GET /api/profiles`

**Résumé :** List Profiles

**Tags :** profiles

**OperationId :** `measurements_api_routes_list_profiles`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[ProfileListItemOut]` |

---

### `POST /api/profiles`

**Résumé :** Create Measurement Profile

**Tags :** profiles

**OperationId :** `measurements_api_routes_create_measurement_profile`

**Auth :** Requise

**Request Body**

Required: **yes**

- `application/json` -> `ProfileCreateIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `GET /api/profiles/{profile_id}`

**Résumé :** Get Profile

**Tags :** profiles

**OperationId :** `measurements_api_routes_get_profile`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `POST /api/profiles/{profile_id}/analyze`

**Résumé :** Analyze Profile

**Tags :** profiles

**OperationId :** `measurements_api_routes_analyze_profile`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | - | - |

---

### `POST /api/profiles/{profile_id}/images`

**Résumé :** Upload Measurement Image

**Tags :** profiles

**OperationId :** `measurements_api_routes_upload_measurement_image`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**

- `multipart/form-data` -> `object`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `PATCH /api/profiles/{profile_id}/measurements`

**Résumé :** Patch Measurements

**Tags :** profiles

**OperationId :** `measurements_api_routes_patch_measurements`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**

- `application/json` -> `MeasurementsUpdateIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `GET /api/users`

**Résumé :** List Users

**Tags :** users

**OperationId :** `users_api_routes_list_users`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[UserOut]` |

---

### `GET /api/users/me`

**Résumé :** Get Me

**Tags :** users

**OperationId :** `users_api_routes_get_me`

**Auth :** Requise

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `PATCH /api/users/me`

**Résumé :** Update Me

**Tags :** users

**OperationId :** `users_api_routes_update_me`

**Auth :** Requise

**Request Body**

Required: **yes**

- `application/json` -> `UserUpdateMeIn`

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `GET /api/users/{user_id}`

**Résumé :** Get User

**Tags :** users

**OperationId :** `users_api_routes_get_user`

**Auth :** Requise

**Paramètres**

| Nom | In | Required | Type |
|---|---|---:|---|
| `user_id` | `path` | yes | `string` |

**Réponses**

| Statut | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

## Schemas

### `MeasurementFieldIn`

Contexte: entrée d'un champ de mesure (value/confidence/source).

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `value` | `object` | no | no |
| `confidence` | `object` | no | no |
| `source` | `object` | no | no |

### `MeasurementFieldOut`

Contexte: sortie d'un champ de mesure (value/confidence/source).

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `value` | `object` | no | no |
| `confidence` | `object` | no | no |
| `source` | `object` | no | no |

### `MeasurementImageOut`

Contexte: métadonnées d'une image de mesure uploadée.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `image_type` | `string` | yes | no |
| `image_url` | `string` | yes | no |
| `uploaded_at` | `string` | yes | no |

### `MeasurementValuesOut`

Contexte: structure des champs de mesures et métadonnées.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `shoulder_width` | `MeasurementFieldOut` | yes | no |
| `sleeve_length` | `MeasurementFieldOut` | yes | no |
| `chest` | `MeasurementFieldOut` | yes | no |
| `waist` | `MeasurementFieldOut` | yes | no |
| `hips` | `MeasurementFieldOut` | yes | no |
| `thigh` | `MeasurementFieldOut` | yes | no |
| `neck` | `MeasurementFieldOut` | yes | no |
| `boubou_length` | `MeasurementFieldOut` | yes | no |
| `fond` | `MeasurementFieldOut` | yes | no |

### `MeasurementsUpdateIn`

Contexte: payload de patch manuel/admin des mesures.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `shoulder_width` | `object` | no | no |
| `sleeve_length` | `object` | no | no |
| `chest` | `object` | no | no |
| `waist` | `object` | no | no |
| `hips` | `object` | no | no |
| `thigh` | `object` | no | no |
| `neck` | `object` | no | no |
| `boubou_length` | `object` | no | no |
| `fond` | `object` | no | no |

### `NotificationMarkReadOut`

Contexte: résultat de marquage notification lue.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `success` | `boolean` | yes | no |

### `NotificationOut`

Contexte: représentation d'une notification utilisateur.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `user_id` | `string` | yes | no |
| `type` | `string` | yes | no |
| `title` | `string` | yes | no |
| `message` | `string` | yes | no |
| `is_read` | `boolean` | yes | no |
| `read_at` | `object` | yes | no |
| `metadata` | `object` | yes | no |
| `created_at` | `string` | yes | no |

### `OrderCreateIn`

Contexte: payload de création de commande.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `profile_id` | `string` | yes | no |
| `tailor_model_id` | `object` | no | no |
| `delivery_date` | `object` | no | no |
| `notes` | `string` | no | no |

### `OrderOut`

Contexte: représentation complète d'une commande.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `user_id` | `string` | yes | no |
| `profile_id` | `string` | yes | no |
| `tailor_model_id` | `object` | yes | no |
| `status` | `string` | yes | no |
| `delivery_date` | `object` | yes | no |
| `final_price` | `object` | yes | no |
| `paid` | `boolean` | yes | no |
| `paid_at` | `object` | yes | no |
| `notes` | `string` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |

### `OrderPatchIn`

Contexte: payload de patch de commande (status/prix/paid...).

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `status` | `object` | no | no |
| `delivery_date` | `object` | no | no |
| `final_price` | `object` | no | no |
| `paid` | `object` | no | no |
| `notes` | `object` | no | no |

### `ProfileCreateIn`

Contexte: payload de création d'un MeasurementProfile.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `user_id` | `string` | yes | no |
| `height_cm` | `number` | yes | no |

### `ProfileListItemOut`

Contexte: version listée (résumée) d'un profile.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `user_id` | `string` | yes | no |
| `height_cm` | `number` | yes | no |
| `status` | `string` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |

### `ProfileOut`

Contexte: objet complet d'un profile de mesures.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `user_id` | `string` | yes | no |
| `height_cm` | `number` | yes | no |
| `status` | `string` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |
| `images` | `array[MeasurementImageOut]` | yes | no |
| `measurements` | `MeasurementValuesOut` | yes | no |

### `PromotionIn`

Contexte: payload de création de promotion.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `label` | `string` | yes | no |
| `percentage` | `object` | yes | no |
| `active` | `boolean` | no | no |
| `starts_at` | `object` | no | no |
| `ends_at` | `object` | no | no |

### `PromotionOut`

Contexte: représentation d'une promotion.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `label` | `string` | yes | no |
| `percentage` | `string` | yes | no |
| `active` | `boolean` | yes | no |
| `starts_at` | `object` | yes | no |
| `ends_at` | `object` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |

### `PromotionPatchIn`

Contexte: payload de patch de promotion.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `label` | `object` | no | no |
| `percentage` | `object` | no | no |
| `active` | `object` | no | no |
| `starts_at` | `object` | no | no |
| `ends_at` | `object` | no | no |

### `TailorModelIn`

Contexte: payload de création d'un modèle catalogue couture.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `title` | `string` | yes | no |
| `category` | `string` | yes | no |
| `base_price` | `object` | yes | no |
| `promotion_id` | `object` | no | no |
| `is_active` | `boolean` | no | no |

### `TailorModelOut`

Contexte: représentation d'un modèle catalogue couture.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `title` | `string` | yes | no |
| `image_url` | `object` | no | no |
| `category` | `string` | yes | no |
| `base_price` | `string` | yes | no |
| `is_active` | `boolean` | yes | no |
| `promotion_id` | `object` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |

### `TailorModelPatchIn`

Contexte: payload de patch d'un modèle catalogue couture.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `title` | `object` | no | no |
| `category` | `object` | no | no |
| `base_price` | `object` | no | no |
| `promotion_id` | `object` | no | no |
| `is_active` | `object` | no | no |

### `TokenOut`

Contexte: tokens JWT retournés après login/refresh.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `access_token` | `string` | yes | no |
| `token_type` | `string` | no | no |

### `UserCreateIn`

Contexte: payload de création de compte utilisateur.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `username` | `string` | yes | no |
| `email` | `string` | yes | no |
| `password` | `string` | yes | no |
| `phone` | `object` | no | no |

### `UserLoginIn`

Contexte: payload de login pour obtenir des JWT tokens.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `username` | `string` | yes | no |
| `password` | `string` | yes | no |

### `UserOut`

Contexte: représentation standard d'un utilisateur.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `username` | `string` | yes | no |
| `email` | `string` | yes | no |
| `phone` | `string` | yes | no |
| `is_staff` | `boolean` | yes | no |

### `UserUpdateMeIn`

Contexte: payload de mise à jour du profil utilisateur connecté.

| Champ | Type | Required | Nullable |
|---|---|---:|---:|
| `email` | `object` | no | no |
| `phone` | `object` | no | no |
| `password` | `object` | no | no |
