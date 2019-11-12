import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TracerService {

  constructor() { }

  initDragElement() {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    const popups = document.getElementsByClassName('popup') as any;

    let elmnt = null;
    let currentZIndex = 100; // TODO reset z index when a threshold is passed

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < popups.length; i++) {
      const popup = popups[i];
      const header = getHeader(popup);

      popup.onmousedown = function() {
        this.style.zIndex = '' + ++currentZIndex;
      };

      if (header) {
        header.parentPopup = popup;
        header.onmousedown = dragMouseDown;
      }
    }
    function dragMouseDown(e) {
      elmnt = this.parentPopup;
      elmnt.style.zIndex = '' + ++currentZIndex;

      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      if (!elmnt) {
        return;
      }

      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function getHeader(element) {
      const headerItems = element.getElementsByClassName('popup-header');

      if (headerItems.length === 1) {
        return headerItems[0];
      }

      return null;
    }
  }

  initResizeElement() {
    const popups = document.getElementsByClassName('popup');
    let element = null;
    let startX;
    let startY;
    let startWidth;
    let startHeight;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < popups.length; i++) {
      const p = popups[i];

      const right = document.createElement('div') as HTMLElement;
      right.className = 'resizer-right';
      p.appendChild(right);
      right.addEventListener('mousedown', initDrag, false);
      // @ts-ignore
      right.parentPopup = p;

      const bottom = document.createElement('div');
      bottom.className = 'resizer-bottom';
      p.appendChild(bottom);
      bottom.addEventListener('mousedown', initDrag, false);
      // @ts-ignore
      bottom.parentPopup = p;

      const both = document.createElement('div');
      both.className = 'resizer-both';
      p.appendChild(both);
      both.addEventListener('mousedown', initDrag, false);
      // @ts-ignore
      both.parentPopup = p;
    }

    function initDrag(e) {
      element = this.parentPopup;

      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(element).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(element).height,
        10
      );
      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
      element.style.width = startWidth + e.clientX - startX + 'px';
      element.style.height = startHeight + e.clientY - startY + 'px';
    }

    function stopDrag() {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
  }
}
