import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

export type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  centered?: boolean;
};

@Component({
  selector: 'app-modal-popup',
  imports: [CommonModule],
  templateUrl: './modal-popup.component.html',
  styleUrl: './modal-popup.component.scss'
})
export class ModalPopupComponent {
  @Input() title = 'Confirmação';
  @Input() message = 'Tens a certeza?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = true;
  @Input() centered = true;

  private modal?: Modal;
  private resolver?: (v: boolean) => void;

  // Abre e devolve uma Promise<boolean>
  open(opts?: ConfirmOptions): Promise<boolean> {
    if (opts) {
      this.title = opts.title ?? this.title;
      this.message = opts.message ?? this.message;
      this.confirmText = opts.confirmText ?? this.confirmText;
      this.cancelText = opts.cancelText ?? this.cancelText;
      this.showCancel = opts.showCancel ?? this.showCancel;
      this.centered = opts.centered ?? this.centered;
    }

    const el = document.getElementById('confirmModal') as HTMLElement;
    this.modal = this.modal ?? new Modal(el, { backdrop: 'static', keyboard: false });
    this.modal.show();

    return new Promise<boolean>(resolve => (this.resolver = resolve));
  }

  confirm() {
    this.modal?.hide();
    this.resolver?.(true);
  }

  cancel() {
    this.modal?.hide();
    this.resolver?.(false);
  }


}
