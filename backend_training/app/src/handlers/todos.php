<?php
require_once(__DIR__ . '/../repositories/todos.php');
require_once(__DIR__ . '/../repositories/statuses.php');

/**
 * GET `/todos` を処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleGetTodos(PDO $pdo): void
{
    try {
        $todos = getAllTodos($pdo);
        echo json_encode(['status' => 'ok', 'data' => $todos]);
    } catch (Exception $e) {
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
 * GET `/todos/{id}` を処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @param string $todoId Todo の ID
 * @return void
 */
function handleGetTodo(PDO $pdo, string $todoId): void
{
    try {
        $todo = getTodo($pdo, $todoId);

        if(empty($todo)){
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Todoが見つかりません',
            ]);
        } else {
            echo json_encode(['status' => 'ok', 'data' => [$todo]]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to get todo',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * POST `/todos` を処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handlePostTodo(PDO $pdo): void
{
    // リクエストボディから JSON データを取得
    $reqBody = getRequestBody();

    // title が含まれていない場合
    if (!isset($reqBody['title'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => '"title" is required.'
        ]);
        exit;
    }

    try {
        // "pending" の ID を取得
        $pendingStatus = getStatus($pdo, 'pending');
        $reqBody['status_id'] = $pendingStatus['id'];

        // データベースに新しいTodoを登録
        $newTodo = createTodo($pdo, $reqBody);

        http_response_code(201);
        echo json_encode(['status' => 'ok', 'data' => [$newTodo]]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todo creation failed.',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * PUT `/todos?id={id}` を処理します。
 * 
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handlePutTodo(PDO $pdo): void
{
    // クエリパラメータから Todo ID を取得
    $todoId = $_GET['id'] ?? null;

    // Todo ID がない場合はエラー
    if ($todoId === null) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todo ID is required in query parameters.'
        ]);
        exit;
    }

    // リクエストボディから JSON データを取得
    $reqBody = getRequestBody();

    // 更新するデータがない場合
    // HACK: todos テーブルのカラム増加に伴って記述量が増える
    if (!isset($reqBody['title']) && !isset($reqBody['status'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => '"title" or "status" is expected.'
        ]);
        exit;
    }

    $status = getStatus($pdo, $reqBody['status'] ?? null);

    try {
        $data = [
            'title' => $reqBody['title'] ?? null,
            'status_id' => $status['id'] ?? null
        ];
        $updatedTodo = updateTodo($pdo, $todoId, $data);

        if(empty($updatedTodo)){
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Todo not found.'
            ]);
        } else {
            http_response_code(200);
            echo json_encode(['status' => 'ok', 'data' => [$updatedTodo]]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todo update failed',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * リクエストボディを取得する
 * 
 * @return array リクエストボディの連想配列
 */
function getRequestBody(): array
{
    $reqBody = file_get_contents('php://input');
    $data = json_decode($reqBody, true);

    if($data === null){
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request body'
        ]);
        exit;
    }

    return $data;
}
