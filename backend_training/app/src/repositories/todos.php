<?php

declare(strict_types=1);

/**
 * 全てのTODOを取得します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return array 全てのTODOのリスト
 */
function getAllTodos(PDO $pdo): array
{
    $stmt = $pdo->query("
        SELECT
            todos.id,
            todos.title,
            statuses.name AS status
        FROM
            todos
            JOIN statuses
                ON todos.status_id = statuses.id
    ");
    $todos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $todos;
}

/**
 * 指定されたIDのTODOを取得します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param int $todoId TODOのID
 * @return array TODOの連想配列
 */
function getTodo(PDO $pdo, int $todoId): array
{
    $stmt = $pdo->prepare("
        SELECT
            todos.id,
            todos.title,
            statuses.name AS status
        FROM
            todos
            JOIN statuses
                ON todos.status_id = statuses.id
        WHERE
            todos.id = :todoId
    ");
    $stmt->bindValue(':todoId', $todoId, PDO::PARAM_INT);
    $stmt->execute();
    $todo = $stmt->fetch(PDO::FETCH_ASSOC);
    return $todo ? $todo : [];
}

/**
 * TODOを作成します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param array $data TODOのデータ
 * @return array 作成されたTODOの連想配列
 */
function createTodo(PDO $pdo, array $data): array
{
    $stmt = $pdo->prepare("INSERT INTO todos (title, status_id) VALUES (:title, :status_id);");
    $stmt->bindValue(':title', $data['title'], PDO::PARAM_STR);
    $stmt->bindValue(':status_id', (int)$data['status_id'], PDO::PARAM_INT);
    $stmt->execute();

    $todoId = $pdo->lastInsertId();
    return getTodo($pdo, (int)$todoId);
}

/**
 * TODOを更新します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param int $todoId TODOのID
 * @param array $data 更新するTODOのデータ
 * @return array 更新されたTODOの連想配列
 */
function updateTodo(PDO $pdo, int $todoId, array $data): array
{
    // SET句を組み立てる
    $setParts = [];
    $params = [];
    foreach ($data as $column => $value) {
        if ($value !== null) {
            $setParts[] = "{$column} = :{$column}";
            $params[":{$column}"] = $value;
        }
    }
    $setClause = implode(", ", $setParts);

    // データベースのTodoを更新
    $stmt = $pdo->prepare("UPDATE todos SET {$setClause} WHERE id = :todoId");
    $params[':todoId'] = $todoId;
    $stmt->execute($params);

    // 更新されたTodoを返却
    return getTodo($pdo, $todoId);
}

/**
 * TODOを削除します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param int $todoId TODOのID
 * @return array 削除されたTODOの連想配列
 */
function deleteTodo(PDO $pdo, int $todoId): array
{
    $todo = getTodo($pdo, $todoId);
    if (empty($todo)) {
        return [];
    }

    $stmt = $pdo->prepare("DELETE FROM todos WHERE id = :todoId;");
    $stmt->bindValue(':todoId', (int)$todoId, PDO::PARAM_INT);
    $stmt->execute();

    return $todo;
}
