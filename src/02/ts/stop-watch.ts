'use strict';

export class StopWatch {
  textEl: HTMLElement;
  startEl: HTMLElement;
  stopEl: HTMLElement;
  resetEl: HTMLElement;
  isRunning: Boolean;
  startTime: number;
  timeDiff: number;
  timer: NodeJS.Timer;
  timerInterval: number;
  constructor() {
    this.textEl = document.querySelector('.sw-text');
    this.startEl = document.querySelector('.sw-control__start');
    this.stopEl = document.querySelector('.sw-control__stop');
    this.resetEl = document.querySelector('.sw-control__reset');
    this.isRunning = false;
    this.startTime = null;
    this.timeDiff = null;
    this.timer = null;
    this.timerInterval = 40;
  }

  /**
   * 初期化
   */
  init(): void {
    console.log('ストップウォッチ初期化');
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
      const text = this.getPastTime().diffText;
      this.showTimerText(text);
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
    if(this.isRunning) {
      // 1.タイマーを停止
      clearTimeout(this.timer);
      // 2.経過時間をセット
      this.timeDiff = this.getPastTime().diff;
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
    this.startTime = null;
    this.timeDiff = null;
    this.timer = null;
    // 2.表示を初期化
      this.changeView('init');
  }

  /**
   * 経過時間を取得
   * @returns diff 差分
   * @returns diffText 成形した文字列
   */
  getPastTime(): { diff: number, diffText: string } {
    // 1.現在時間と開始時間の差分を計算
    // ※経過時間が保持されている場合はその値を追加
    const date = new Date();
    const addTime = this.timeDiff ? this.timeDiff : 0;
    const diff: number = date.getTime() - this.startTime + addTime;
    // 2.差分を成形
    const m = Math.floor(diff / 60000);
    const s = Math.floor(diff % 60000 / 1000);
    const ms = diff % 1000;
    const diffText: string =
      ('0' + m).slice(-2) +
      ':' +
      ('0' + s).slice(-2) +
      ':' +
      ('0' + ms).slice(-3).slice(0, 2);
    // 3.差分と成形した文字列を返す
    return {diff, diffText};
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
        // 1.「開始」を表示
        this.startEl.classList.remove('is-hidden');
        // 2.「停止」「リセット」を非表示
        this.stopEl.classList.add('is-hidden');
        this.resetEl.classList.add('is-hidden');
        break;

      case 'run':
        // 1.「停止」を表示
        this.stopEl.classList.remove('is-hidden');
        // 2.「開始」「リセット」を非表示
        this.startEl.classList.add('is-hidden');
        this.resetEl.classList.add('is-hidden');
        break;

      case 'stop':
        // 1.「開始」「リセット」を表示
        this.startEl.classList.remove('is-hidden');
        this.resetEl.classList.remove('is-hidden');
        // 2.「停止」を非表示
        this.stopEl.classList.add('is-hidden');
        break;

      default:
        break;
    }
  }

  /**
   * 開始ボタンクリック時のイベント設定
   */
  clickStartHandler(): void {
    this.startEl.addEventListener('click', () => this.start());
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
