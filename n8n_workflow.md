# Workflow n8n: WhatsApp para CRM

Este workflow integra o WhatsApp Business API com o backend do CRM via Edge Functions.

## Passos do Workflow

1.  **Webhook WhatsApp**: Recebe a mensagem do cliente.
2.  **AI Agent / Parser**: Processa o texto da mensagem para extrair:
    *   Nome do cliente
    *   Itens do pedido (nome, quantidade)
    *   Endereço (se fornecido)
3.  **HTTP Request (POST /orders/from-whatsapp)**:
    *   **URL**: `https://<project-ref>.supabase.co/functions/v1/crm-api/orders/from-whatsapp`
    *   **Headers**: `Authorization: Bearer <SERVICE_ROLE_KEY>`
    *   **Body**:
        ```json
        {
          "company_id": "uuid-da-empresa",
          "customer_whatsapp": "5511999999999",
          "customer_name": "Nome do Cliente",
          "total": 150.00,
          "items": [
            { "product_id": "uuid-prod", "name": "Pizza Margherita", "quantity": 1, "price": 45.90 }
          ]
        }
        ```
4.  **Confirmação WhatsApp**: Envia mensagem de volta ao cliente confirmando o recebimento do pedido.

## Benefícios
*   **Realtime**: O pedido aparece instantaneamente no Kanban do frontend via Supabase Realtime.
*   **Persistência**: Dados salvos no PostgreSQL via Edge Function.
*   **Escalabilidade**: n8n gerencia a fila de mensagens e o backend processa a lógica de negócio.
