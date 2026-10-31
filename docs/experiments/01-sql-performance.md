# 01: SQL performance

**状態：未着手**

## 症状・目的
インデックスなしの注文検索SQLが遅い理由を実行計画から説明する。

## 対象SQL

```sql
SELECT id, user_id, total, created_at
FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 20;
```

## 実験
- データ件数：未計測
- 改善前：`EXPLAIN (ANALYZE, BUFFERS)` を保存
- 仮説：未記入
- 対策候補：複合インデックス等（原因確認後に採否判断）
- 改善後：同条件で再計測

## 観測結果・考察
未記入
