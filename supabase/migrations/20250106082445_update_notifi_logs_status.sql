create type notification_status as enum (
  'pending',   -- Notification is created but not sent yet
  'success',   -- Notification sent successfully
  'failed',    -- Notification failed to send
  'retrying'   -- Notification is being retried
);

alter table notification_logs
  alter column status type notification_status using status::notification_status;
