import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../ui/button/button.component';
import { Supplier } from '../../../../models/supplier.model';

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './supplier-modal.component.html'
})
export class SupplierModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() supplier?: Supplier;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Supplier>>();

  supplierForm: FormGroup;
  initialValues: any = {};

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      nameSupplier: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplier'] && this.supplier) {
      this.initialValues = { ...this.supplier };
      this.supplierForm.patchValue(this.supplier);
    } else if (changes['isVisible'] && this.isVisible && !this.supplier) {
      this.supplierForm.reset();
      this.initialValues = {};
    }
  }

  isFieldModified(controlName: string): boolean {
    if (!this.supplier) return false;
    const currentValue = this.supplierForm.get(controlName)?.value;
    const initialValue = this.initialValues[controlName as keyof Supplier];
    return currentValue !== initialValue && this.supplierForm.get(controlName)?.dirty === true;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      this.save.emit(this.supplierForm.value);
    } else {
      Object.values(this.supplierForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
  }
}
