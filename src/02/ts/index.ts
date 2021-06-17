'use strict';

import { StopWatch } from './stop-watch';
import { Timer } from './timer';

export class StopWatchTimer {
  tabEl: HTMLElement;
  contentsEl: HTMLElement;
  contentsList: Array<{id: string, text: string}>;
  currentContent: number;
  StopWatch: StopWatch;
  Timer: Timer;
  constructor() {
    this.tabEl = document.querySelector('.tabs__container');
    this.contentsEl = document.querySelector('.contents');
    this.contentsList = [
      {id: 'sw', text: 'ストップウォッチ'},
      {id: 'timer', text: 'タイマー'},
    ];
    this.currentContent = 0;
    this.StopWatch = new StopWatch();
    this.Timer = new Timer();
  }

  /**
   * 初期化
   */
  init(): void {
    this.tabInitView();
    this.contentsInitView();
    this.onClickTabHandler();
    this.StopWatch.init();
    this.Timer.init();
  }

  /**
   * タブの初期描画
   */
  tabInitView(): void {
    // 1.タブを挿入
    let markup = '';
    for(let i = 0; i < this.contentsList.length; i++) {
      markup += `
        <li><a>${this.contentsList[i].text}</a></li>
      `;
    }
    this.tabEl.innerHTML = markup;
    // 2.「currentContent」のタブをアクティブにする
    this.changeTab(this.currentContent);
  }

  /**
   * タブの切り替え
   * @param index 表示するタブの番号
   */
  changeTab(index: number): void {
    // 1.全てのタブの「is-active」クラスを削除
    Array.from(this.tabEl.children).forEach(item => {
      item.classList.remove('is-active');
    });
    // 2.引数番目のタブに「is-active」クラスを付与
    this.tabEl.children[index].classList.add('is-active');
  }

  /**
   * コンテンツの初期描画
   */
  contentsInitView(): void {
    this.changeContents(this.currentContent);
  }

  /**
   * コンテンツの切り替え
   * @param index 表示するコンテンツの番号
   */
  changeContents(index: number): void {
    // 1.全てのコンテンツの「is-hidden」クラスを付与
    Array.from(this.contentsEl.children).forEach(item => {
      item.classList.add('is-hidden');
    });
    // 2.引数番目のタブに「is-active」クラスを削除
    this.contentsEl.children[index].classList.remove('is-hidden');
  }

  /**
   * タブクリック時のイベント設定
   */
  onClickTabHandler(): void {
    this.tabEl.addEventListener('click', e => {
      const targetEl = <HTMLAnchorElement>e.target;
      // 1.実行中のコンテンツを停止
      this.StopWatch.stop();
      this.Timer.stop();

      // 2.クリックされたタブのindexを取得
      const tabItemEls = this.tabEl.getElementsByTagName('li');
      const itemIndex = Array.from(tabItemEls).indexOf(targetEl.closest('li'));
      // 3.取得したindexに応じた内容を表示
      this.changeTab(itemIndex);
      this.changeContents(itemIndex);
    });
  }
}
