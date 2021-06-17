'use strict';

export class Timer {
  textEl: HTMLElement;
  formEl: HTMLFormElement;
  inputSetEl: HTMLElement;
  inputEl: HTMLElement;
  startEl: HTMLElement;
  stopEl: HTMLElement;
  resetEl: HTMLElement;
  isRunning: Boolean;
  startTime: number;
  remainTime: number;
  timer: NodeJS.Timer;
  timerInterval: number;
  constructor() {
    this.textEl = document.querySelector('.timer-text');
    this.formEl = document.querySelector('form[name="timerForm"]');
    this.inputSetEl = document.querySelector('.timer-input__container');
    this.inputEl = document.querySelector('.timer-input');
    this.startEl = document.querySelector('.timer-control__start');
    this.stopEl = document.querySelector('.timer-control__stop');
    this.resetEl = document.querySelector('.timer-control__reset');
    this.isRunning = false;
    this.startTime = null;
    this.remainTime = null;
    this.timer = null;
    this.timerInterval = 40;
  }

  /**
   * 初期化
   */
  init(): void {
    console.log('タイマー初期化');
    this.changeView('init');
    this.clickStartHandler();
    this.clickStopHandler();
    this.clickResetHandler();
  }

  /**
   * 開始
   */
  start(): void {
    // 1.タイマーを開始
    const date = new Date()
    this.startTime = date.getTime();
    this.timer = setInterval(() => {
      if (this.getRemainTime().remain > 0) {
        const text = this.getRemainTime().remainText;
        this.showTimerText(text);
      } else {
        // 残り時間がなくなった場合はタイマーを停止
        this.stop();
        this.showTimerText('00:00:00');
        this.clearState();
        setTimeout(() => {
          alert('時間が経過しました');
        }, this.timerInterval);
      }
    }, this.timerInterval);
    // 2.実行状態を変更
    this.isRunning = true;
    // 3.ボタンの表示変更
    this.changeView('run');
  }

  /**
   * 停止
   */
  stop(): void {
    if (this.isRunning) {
      // 1.タイマーを停止
      clearTimeout(this.timer);
      // 2.経過時間をセット
      this.remainTime = this.getRemainTime().remain;
      // 3.実行状態を変更
      this.isRunning = false;
      // 4.ボタンの表示変更
      this.changeView('stop');
    }
  }

  /**
   * リセット
   */
  reset(): void {
    // 1.各種状態をクリア
    this.clearState();
    // 2.表示を初期化
    this.changeView('init');
  }

  /**
   * 状態をクリア
   */
  clearState(): void {
    this.startTime = null;
    this.remainTime = null;
    this.timer = null;
  }

  /**
   * 残り時間を取得
   * @returns remain 残り
   * @returns remainText 成形した文字列
   */
  getRemainTime(): { remain: number, remainText: string } {
    // 1.現在時間と開始時間の差分を計算
    const date = new Date();
    const diff = date.getTime() - this.startTime;
    // 2.差分から残り時間を計算
    const remain = this.remainTime - diff;
    // 3.残り時間を成形
    const m = Math.floor(remain / 60000);
    const s = Math.floor(remain % 60000 / 1000);
    const ms = remain % 1000;
    const remainText: string =
      ('0' + m).slice(-2) +
      ':' +
      ('0' + s).slice(-2) +
      ':' +
      ('0' + ms).slice(-3).slice(0, 2);
    // 3.差分と成形した文字列を返す
    return {remain, remainText};
  }

  /**
   * 入力されている時間を取得
   * @returns input 入力値
   */
  getInputTime(): number {
    // 1.入力欄から値を取得
    // @ts-ignore
    const m = this.formEl.min.value || 0;
    // @ts-ignore
    const s = this.formEl.sec.value || 0;
    // @ts-ignore
    const ms = this.formEl.mSec.value || 0;
    // 2.ミリ秒の合計を計算
    const input = parseInt(m) * 60000 + parseInt(s) * 1000 + parseInt(ms);
    // 3.ミリ秒を返す
    return input;
  }

  /**
   * タイマーの文字を表示
   * @param text 表示するテキスト
   */
  showTimerText(text: string): void {
    this.textEl.textContent = text;
  }

  /**
   * 画面表示を変更
   * @param type 表示タイプ
   */
  changeView(type: 'init' | 'run' | 'stop') {
    switch (type) {
      case 'init':
        this.showTimerText('00:00:00');
        // 1.「開始」「リセット」を表示
        this.startEl.classList.remove('is-hidden');
        this.resetEl.classList.remove('is-hidden');
        // 2.「停止」を非表示
        this.stopEl.classList.add('is-hidden');
        // 3.入力部分の値を初期化
        this.formEl.reset();
        break;

      case 'run':
        // 1.「停止」を表示
        this.stopEl.classList.remove('is-hidden');
        // 2.「開始」「リセット」を非表示
        this.startEl.classList.add('is-hidden');
        this.resetEl.classList.add('is-hidden');
        // 3.入力フォームを無効
        this.inputSetEl.setAttribute('disabled', 'true');
        break;

      case 'stop':
        // 1.「開始」「リセット」を表示
        this.startEl.classList.remove('is-hidden');
        this.resetEl.classList.remove('is-hidden');
        // 2.「停止」を非表示
        this.stopEl.classList.add('is-hidden');
        // 3.入力フォームを有効
        this.inputSetEl.removeAttribute('disabled');
        break;

      default:
        break;
    }
  }

  /**
   * 開始ボタンクリック時のイベント設定
   */
  clickStartHandler(): void {
    this.startEl.addEventListener('click', () => {
      // フォームの入力値が「0」の場合は挙動させない
      if (!this.getInputTime()) {
        alert('タイマーの時間を設定してください');
        return;
      }
      // 残り時間がセットされていない場合
      if (!this.remainTime) {
        this.remainTime = this.getInputTime();
      }
      this.start();
    });
  }

  /**
   * 停止ボタンクリック時のイベント設定
   */
  clickStopHandler(): void {
    this.stopEl.addEventListener('click', () => this.stop());
  }

  /**
   * リセットボタンクリック時のイベント設定
   */
  clickResetHandler(): void {
    this.resetEl.addEventListener('click', () => this.reset());
  }
}
