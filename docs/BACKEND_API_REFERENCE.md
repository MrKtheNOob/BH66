# BH66 Tailoring API - Endpoint Reference

Version: `1.0.0`

Generated from `docs/backend_openapi.json`.

## Endpoints

### `POST /api/auth/login`

**Summary:** Login User
**Tags:** auth
**OperationId:** `users_api_routes_login_user`
**Auth:** None

**Request Body**

Required: **yes**
- `application/json` -> `UserLoginIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TokenOut` |

---

### `POST /api/auth/logout`

**Summary:** Logout User
**Tags:** auth
**OperationId:** `users_api_routes_logout_user`
**Auth:** None

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | - | - |

---

### `POST /api/auth/refresh`

**Summary:** Refresh Token
**Tags:** auth
**OperationId:** `users_api_routes_refresh_token`
**Auth:** None

**Request Body**

Required: **no**

Refresh token is read from the `bh66_refresh_token` HttpOnly cookie.

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TokenOut` |

---

### `POST /api/auth/register`

**Summary:** Register User
**Tags:** auth
**OperationId:** `users_api_routes_register_user`
**Auth:** None

**Request Body**

Required: **yes**
- `application/json` -> `UserCreateIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `GET /api/notifications`

**Summary:** List Notifications
**Tags:** notifications
**OperationId:** `notifications_api_routes_list_notifications`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[NotificationOut]` |

---

### `PATCH /api/notifications/{notification_id}/read`

**Summary:** Mark Notification Read
**Tags:** notifications
**OperationId:** `notifications_api_routes_mark_notification_read`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `notification_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `NotificationMarkReadOut` |

---

### `GET /api/orders`

**Summary:** List Orders
**Tags:** orders
**OperationId:** `orders_api_routes_list_orders`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[OrderOut]` |

---

### `POST /api/orders`

**Summary:** Create Order Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_create_order_endpoint`
**Auth:** Required

**Request Body**

Required: **yes**
- `application/json` -> `OrderCreateIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `GET /api/orders/catalog-models`

**Summary:** List Tailor Models
**Tags:** orders
**OperationId:** `orders_api_routes_list_tailor_models`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[TailorModelOut]` |

---

### `POST /api/orders/catalog-models`

**Summary:** Create Tailor Model Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_create_tailor_model_endpoint`
**Auth:** Required

**Request Body**

Required: **yes**
- `multipart/form-data` -> `object`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `GET /api/orders/catalog-models/{model_id}`

**Summary:** Get Tailor Model
**Tags:** orders
**OperationId:** `orders_api_routes_get_tailor_model`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `model_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `PATCH /api/orders/catalog-models/{model_id}`

**Summary:** Patch Tailor Model Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_patch_tailor_model_endpoint`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `model_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**
- `application/json` -> `TailorModelPatchIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `TailorModelOut` |

---

### `GET /api/orders/promotions`

**Summary:** List Promotions
**Tags:** orders
**OperationId:** `orders_api_routes_list_promotions`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[PromotionOut]` |

---

### `POST /api/orders/promotions`

**Summary:** Create Promotion Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_create_promotion_endpoint`
**Auth:** Required

**Request Body**

Required: **yes**
- `application/json` -> `PromotionIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `PromotionOut` |

---

### `PATCH /api/orders/promotions/{promotion_id}`

**Summary:** Patch Promotion Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_patch_promotion_endpoint`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `promotion_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**
- `application/json` -> `PromotionPatchIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `PromotionOut` |

---

### `GET /api/orders/{order_id}`

**Summary:** Get Order
**Tags:** orders
**OperationId:** `orders_api_routes_get_order`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `order_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `PATCH /api/orders/{order_id}`

**Summary:** Patch Order Endpoint
**Tags:** orders
**OperationId:** `orders_api_routes_patch_order_endpoint`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `order_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**
- `application/json` -> `OrderPatchIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `OrderOut` |

---

### `GET /api/profiles`

**Summary:** List Profiles
**Tags:** profiles
**OperationId:** `measurements_api_routes_list_profiles`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[ProfileListItemOut]` |

---

### `POST /api/profiles`

**Summary:** Create Measurement Profile
**Tags:** profiles
**OperationId:** `measurements_api_routes_create_measurement_profile`
**Auth:** Required

**Request Body**

Required: **yes**
- `application/json` -> `ProfileCreateIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `GET /api/profiles/{profile_id}`

**Summary:** Get Profile
**Tags:** profiles
**OperationId:** `measurements_api_routes_get_profile`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `POST /api/profiles/{profile_id}/analyze`

**Summary:** Analyze Profile
**Tags:** profiles
**OperationId:** `measurements_api_routes_analyze_profile`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | - | - |

---

### `POST /api/profiles/{profile_id}/images`

**Summary:** Upload Measurement Image
**Tags:** profiles
**OperationId:** `measurements_api_routes_upload_measurement_image`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**
- `multipart/form-data` -> `object`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `PATCH /api/profiles/{profile_id}/measurements`

**Summary:** Patch Measurements
**Tags:** profiles
**OperationId:** `measurements_api_routes_patch_measurements`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `profile_id` | `path` | yes | `string` |

**Request Body**

Required: **yes**
- `application/json` -> `MeasurementsUpdateIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `ProfileOut` |

---

### `GET /api/users`

**Summary:** List Users
**Tags:** users
**OperationId:** `users_api_routes_list_users`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `array[UserOut]` |

---

### `GET /api/users/me`

**Summary:** Get Me
**Tags:** users
**OperationId:** `users_api_routes_get_me`
**Auth:** Required

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `PATCH /api/users/me`

**Summary:** Update Me
**Tags:** users
**OperationId:** `users_api_routes_update_me`
**Auth:** Required

**Request Body**

Required: **yes**
- `application/json` -> `UserUpdateMeIn`

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

### `GET /api/users/{user_id}`

**Summary:** Get User
**Tags:** users
**OperationId:** `users_api_routes_get_user`
**Auth:** Required

**Parameters**

| Name | In | Required | Type |
|---|---|---:|---|
| `user_id` | `path` | yes | `string` |

**Responses**

| Status | Content-Type | Schema |
|---:|---|---|
| `200` | `application/json` | `UserOut` |

---

## Schemas

### `MeasurementFieldIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `value` | `object` | no | no |
| `confidence` | `object` | no | no |
| `source` | `object` | no | no |

### `MeasurementFieldOut`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `value` | `object` | no | no |
| `confidence` | `object` | no | no |
| `source` | `object` | no | no |

### `MeasurementImageOut`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `image_type` | `string` | yes | no |
| `image_url` | `string` | yes | no |
| `uploaded_at` | `string` | yes | no |

### `MeasurementValuesOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `success` | `boolean` | yes | no |

### `NotificationOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `profile_id` | `string` | yes | no |
| `tailor_model_id` | `object` | no | no |
| `delivery_date` | `object` | no | no |
| `notes` | `string` | no | no |

### `OrderOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `status` | `object` | no | no |
| `delivery_date` | `object` | no | no |
| `final_price` | `object` | no | no |
| `paid` | `object` | no | no |
| `notes` | `object` | no | no |

### `ProfileCreateIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `user_id` | `string` | yes | no |
| `height_cm` | `number` | yes | no |

### `ProfileListItemOut`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `user_id` | `string` | yes | no |
| `height_cm` | `number` | yes | no |
| `status` | `string` | yes | no |
| `created_at` | `string` | yes | no |
| `updated_at` | `string` | yes | no |

### `ProfileOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `label` | `string` | yes | no |
| `percentage` | `object` | yes | no |
| `active` | `boolean` | no | no |
| `starts_at` | `object` | no | no |
| `ends_at` | `object` | no | no |

### `PromotionOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `label` | `object` | no | no |
| `percentage` | `object` | no | no |
| `active` | `object` | no | no |
| `starts_at` | `object` | no | no |
| `ends_at` | `object` | no | no |

### `TailorModelIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `title` | `string` | yes | no |
| `category` | `string` | yes | no |
| `base_price` | `object` | yes | no |
| `promotion_id` | `object` | no | no |
| `is_active` | `boolean` | no | no |

### `TailorModelOut`

| Field | Type | Required | Nullable |
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

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `title` | `object` | no | no |
| `category` | `object` | no | no |
| `base_price` | `object` | no | no |
| `promotion_id` | `object` | no | no |
| `is_active` | `object` | no | no |

### `TokenOut`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `access_token` | `string` | yes | no |
| `token_type` | `string` | no | no |

### `UserCreateIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `username` | `string` | yes | no |
| `email` | `string` | yes | no |
| `password` | `string` | yes | no |
| `phone` | `object` | no | no |

### `UserLoginIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `username` | `string` | yes | no |
| `password` | `string` | yes | no |

### `UserOut`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `id` | `string` | yes | no |
| `username` | `string` | yes | no |
| `email` | `string` | yes | no |
| `phone` | `string` | yes | no |
| `is_staff` | `boolean` | yes | no |

### `UserUpdateMeIn`

| Field | Type | Required | Nullable |
|---|---|---:|---:|
| `email` | `object` | no | no |
| `phone` | `object` | no | no |
| `password` | `object` | no | no |
