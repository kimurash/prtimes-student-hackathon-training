<?php

declare(strict_types=1);

/**
 * ステータスの名前からIDを取得します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param string $statusName ステータスの名前
 * @return array ステータスの連想配列
 */
function getStatus(PDO $pdo, string $statusName): array
{
    $stmt = $pdo->prepare("SELECT * FROM statuses WHERE name = :name;");
    $stmt->execute([':name' => $statusName]);
    $status = $stmt->fetch(PDO::FETCH_ASSOC);
    return $status ? $status : [];
}
