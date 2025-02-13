<?php
/**
 * `/todos` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleGetTodos(PDO $pdo): void
{
    try {
        // データベースからTodoリストを取得
        $stmt = $pdo->query("SELECT todos.id, todos.title, statuses.name FROM todos JOIN statuses ON todos.status_id = statuses.id;");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // レスポンスを返却
        echo json_encode(['status' => 'ok', 'data' => $result]);
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to get todos',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos/{id}` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param string $todoId Todo の ID
 * @return void
 */
function handleGetTodo(PDO $pdo, string $todoId): void
{
    try {
        // 指定されたIDのTodoを取得
        $stmt = $pdo->prepare("SELECT todos.id, todos.title, statuses.name FROM todos JOIN statuses ON todos.status_id = statuses.id WHERE todos.id = :todoId;");
        $stmt->bindParam(':todoId', $todoId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if(empty($result)){
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Todoが見つかりません',
            ]);
        } else{
            // レスポンスを返却
            echo json_encode(['status' => 'ok', 'data' => [$result]]);
        }
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to get todos',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}
