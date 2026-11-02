-- Phase 0: 最小スキーマ。性能改善用の追加インデックスは作らない。
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  total       NUMERIC(12, 2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
