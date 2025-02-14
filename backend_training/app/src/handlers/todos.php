<?php

declare(strict_types=1);

require_once(__DIR__ . '/../repositories/todos.php');
require_once(__DIR__ . '/../repositories/statuses.php');

require_once(__DIR__ . '/../models/request/TodoRequestData.php');

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
                'message' => 'Todo not found',
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

    // リクエストボディのバリデーション
    $todoData = new TodoRequestData($reqBody);
    if(!$todoData->validateTitle()){
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => '"title" is required.'
        ]);
        exit;
    }
    
    // バリデーション済みのデータを取得
    $validTodoData = $todoData->getTodoData();

    try {
        // "pending" の ID を取得
        $pendingStatus = getStatus($pdo, 'pending');
        $validTodoData['status_id'] = $pendingStatus['id'];

        // データベースに新しいTodoを登録
        $newTodo = createTodo($pdo, $validTodoData);

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

    // リクエストボディのバリデーション
    $todoData = new TodoRequestData($reqBody);
    if(!$todoData->isAtLeastOneValid()){
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'At least one property must be valid'
        ]);
        exit;
    }

    // バリデーション済みのデータを取得
    $validTodoData = $todoData->getTodoData();

    try {
        if(isset($validTodoData['status'])){ // ステータスを更新する場合
            // ステータスのIDを取得
            $status = getStatus($pdo, $validTodoData['status']);
            $validTodoData['status_id'] = $status['id'];
            unset($validTodoData['status']);
        }

        // データベースのTodoを更新
        $updatedTodo = updateTodo($pdo, $todoId, $validTodoData);

        if(empty($updatedTodo)){ // 更新されたTodoがない場合
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Todo not found.'
            ]);
        } else { // 無事に更新された場合
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

function handleDeleteTodo(PDO $pdo): void
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

    try{
        // データベースのTodoを削除
        $deletedTodo = deleteTodo($pdo, $todoId);

        if(empty($deletedTodo)){ // 削除されたTodoがない場合
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Todo not found.'
            ]);
        } else { // 無事に削除された場合
            http_response_code(200);
            echo json_encode(['status' => 'ok', 'data' => [$deletedTodo]]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Todo deletion failed',
            'error' => $e->getMessage()
        ]);
    }
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
        logJSONError();

        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request body'
        ]);
        exit;
    }

    return $data;
}

function logJSONError(): void
{
    $err_code = json_last_error();
    $err_msg = json_last_error_msg();
    error_log("JSON_ERROR({$err_code}): {$err_msg}");
}
