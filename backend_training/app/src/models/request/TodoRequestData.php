<?php

declare(strict_types=1);

/**
 * リクエストボディに含まれる Todo データをバリデーションするクラス
 *
 * @property ?string $title  Todo のタイトル (nullable)
 * @property ?string $status Todo の状態 (nullable)
 */
class TodoRequestData
{
    /** @var string|null $title Todo のタイトル (nullable) */
    public ?string $title;
    /** @var string|null $status Todo の状態 (nullable) */
    public ?string $status;

    /** @var array<int, string> STATUSES  取りうる状態の定義 */
    private const STATUSES = ['未着手', '作業中', '完了'];

    /**
     * コンストラクタ
     *
     * @param array $requestBody リクエストボディ
     */
    public function __construct(array $requestBody)
    {
        $this->title  = $requestBody['title'] ?? null;
        $this->status = $requestBody['status'] ?? null;
    }

    /**
     * Todo のデータを取得する
     * 
     * @return array Todo のデータ
     */
    public function getTodoData(): array
    {
        return [
            'title' => $this->title,
            'status' => $this->status
        ];
    }

    /**
     * 全てのバリデーションを実行する
     *
     * @return bool バリデーションが成功した場合はtrue(失敗した場合はfalse)
     */
    public function validate(): bool
    {
        if(!$this->validateTitle()){
            return false;
        }
        if(!$this->validateStatus()){
            return false;
        }

        return true;
    }

    /**
     * タイトルをバリデーションする
     *
     * タイトルが設定されており、かつ1文字以上であることをチェックする
     *
     * @return bool バリデーションが成功した場合はtrue(失敗した場合はfalse)
     */
    public function validateTitle(): bool
    {
        if(!isset($this->title)){
            return false;
        }
        if(strlen($this->title) < 1){
            return false;
        }
        return true;
    }

    /**
     * 状態をバリデーションする
     *
     * バリデーションの内容
     * - null でない
     * - 取りうる状態のいずれかである
     *
     * @return bool バリデーションが成功した場合はtrue(失敗した場合はfalse)
     */
    public function validateStatus(): bool
    {
        if (!isset($this->status)) {
            return false;
        }
        if(!in_array($this->status, self::STATUSES)){
            return false;
        }
        return true;
    }

    /**
     * 少なくとも1つのプロパティが正しいか確認する
     *
     * @return bool 少なくとも1つのプロパティが正しい場合はtrue(そうでない場合はfalse)
     */
    public function isAtLeastOneValid(): bool
    {
        if($this->validateTitle()){
            return true;
        }
        if($this->validateStatus()){
            return true;
        }
        return false;
    }
}
