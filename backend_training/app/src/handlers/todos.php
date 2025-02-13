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

function handlePostTodo(PDO $pdo): void
{
    // リクエストボディから JSON データを取得
    $requestBody = file_get_contents('php://input');
    $todo = json_decode($requestBody, true); // true を指定して連想配列としてデコード

    // JSON デコードに失敗した場合
    if($todo === null){
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request body'
        ]);
        exit;
    }

    // title が存在しない場合はエラー
    if (!isset($todo['title'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => '"title" is required.'
        ]);
        exit;
    }

    $title = $todo['title'];

    try {
        // データベースに新しいTodoを登録
        $sql = "INSERT INTO todos (title, status_id) VALUES (:title, 1)"; // status_id はデフォルトで 1 (未完了)
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':title' => $title]);

        // 作成されたTodoの ID を取得
        $todoId = $pdo->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'status' => 'ok', 
            'data' => [[
                'id' => $todoId,
                'title' => $title,
                'status' => 'pending'
            ]]
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todo creation failed',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}
