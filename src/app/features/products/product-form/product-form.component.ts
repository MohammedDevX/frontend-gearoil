import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentCardComponent } from '../../../ui/component-card/component-card.component';
import { LabelComponent } from '../../../ui/label/label.component';
import { InputFieldComponent } from '../../../ui/input/input-field.component';
import { SelectComponent, Option as SelectOption } from '../../../ui/select/select.component';
import { MultiSelectComponent, Option as MultiSelectOption } from '../../../ui/multi-select/multi-select.component';
import { DropzoneComponent } from '../../../ui/dropzone/dropzone.component';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    ComponentCardComponent, 
    LabelComponent, 
    InputFieldComponent, 
    SelectComponent, 
    MultiSelectComponent,
    DropzoneComponent
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  
  categoryOptions: SelectOption[] = [];
  
  supplierOptions: SelectOption[] = [];
  
  carTypeOptions: MultiSelectOption[] = [
    { value: 'SUV', text: 'SUV' },
    { value: 'Sedan', text: 'Sedan' },
    { value: 'Hatchback', text: 'Hatchback' },
    { value: 'Coupe', text: 'Coupe' },
    { value: 'Truck', text: 'Truck' },
    { value: 'Van', text: 'Van' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    this.initForm();
    this.loadDependencies();
    if (this.isEditMode) {
      this.loadProduct();
    }
  }

  loadDependencies() {
    this.productService.getCategories().subscribe(res => {
      this.categoryOptions = res.map(c => ({
        value: c['@id'] || `/api/categories/${c.id}`,
        label: c.name
      }));
    });

    this.productService.getSuppliers().subscribe(res => {
      this.supplierOptions = res.map(s => ({
        value: s['@id'] || `/api/suppliers/${s.id}`,
        label: s.nameSupplier || s.name || 'Unknown Supplier'
      }));
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      volume: [null, [Validators.min(0)]],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      carType: [[]],
      specifications: this.fb.array([])
    });

    this.productForm.get('category')?.valueChanges.subscribe(val => {
      const selectedCat = this.categoryOptions.find(o => o.value === val);
      if (selectedCat && selectedCat.label.toLowerCase().includes('huile')) {
         if (this.specifications.length === 0) {
            this.addSpecificationWith('Viscosite', '');
            this.addSpecificationWith('Type', '');
         }
      }
    });
  }

  get specifications() {
    return this.productForm.get('specifications') as FormArray;
  }

  addSpecification() {
    this.addSpecificationWith('', '');
  }

  addSpecificationWith(key: string, value: string) {
    this.specifications.push(this.fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required]
    }));
  }

  removeSpecification(index: number) {
    this.specifications.removeAt(index);
  }

  loadProduct() {
    // Mock loading for UI testing
  }

  onFileDropped(files: File[]) {
    console.log('Product images dropped:', files);
  }

  isCarTypeSelected(type: string): boolean {
    const currentTypes = this.productForm.get('carType')?.value as string[];
    if (!currentTypes) return false;
    return currentTypes.includes(type);
  }

  onCarTypeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    const isChecked = checkbox.checked;
    
    let currentTypes = this.productForm.get('carType')?.value as string[];
    if (!currentTypes) currentTypes = [];

    if (isChecked) {
      if (!currentTypes.includes(value)) {
        this.productForm.get('carType')?.setValue([...currentTypes, value]);
      }
    } else {
      this.productForm.get('carType')?.setValue(currentTypes.filter(t => t !== value));
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValues = this.productForm.value;

    // Transform specifications from Array of {key, value} to Hash Object { "key": "value" }
    const specificationsHash: { [key: string]: string } = {};
    formValues.specifications.forEach((spec: { key: string, value: string }) => {
      if (spec.key && spec.value) {
        specificationsHash[spec.key] = spec.value;
      }
    });

    const payload = {
      ...formValues,
      specifications: specificationsHash,
    };

    console.log('Payload ready for Backend:', payload);
    this.loading = true;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product', err);
          this.loading = false;
        }
      });
    } else {
      this.productService.addProduct(payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error adding product', err);
          this.loading = false;
        }
      });
    }
  }
}
