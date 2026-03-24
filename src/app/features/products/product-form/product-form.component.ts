import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('specContainer') specContainer!: ElementRef;
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  uploadedImageUrl: string | null = null;
  
  categoryOptions: SelectOption[] = [
    { value: 'oil', label: 'Oil / Huile' },
    { value: 'equipment', label: 'Equipment' }
  ];

  supplierOptions: SelectOption[] = [];
  
  carTypeOptions: MultiSelectOption[] = [
    { value: 'car', text: 'Car' },
    { value: 'truck', text: 'Truck' },
    { value: 'motorcycle', text: 'Motorcycle' }
  ];

  oilSpecKeys: SelectOption[] = [
    { value: 'Contenance', label: 'Contenance (Capacity)' },
    { value: 'Viscosité', label: 'Viscosité' },
    { value: 'API', label: 'API Standard' },
    { value: 'ACEA', label: 'ACEA Standard' },
    { value: 'Base', label: 'Base (Synthétique/Minérale)' },
    { value: 'Compatibilité constructeur', label: 'Compatibilité constructeur' },
    { value: 'Avantages', label: 'Avantages' },
    { value: 'Applications', label: 'Applications' }
  ];

  equipmentSpecKeys: SelectOption[] = [
    { value: 'Type', label: 'Type Équipement' },
    { value: 'Matériau', label: 'Matériau' },
    { value: 'Dimensions', label: 'Dimensions' }
  ];

  viscosityOptions: SelectOption[] = [
    { value: '0W-20', label: '0W-20' }, { value: '0W-30', label: '0W-30' },
    { value: '5W-20', label: '5W-20' }, { value: '5W-30', label: '5W-30' },
    { value: '5W-40', label: '5W-40' }, { value: '10W-30', label: '10W-30' },
    { value: '10W-40', label: '10W-40' }, { value: '15W-40', label: '15W-40' },
    { value: '20W-50', label: '20W-50' }
  ];

  apiOptions: SelectOption[] = [
    { value: 'SN', label: 'API SN' }, { value: 'SM', label: 'API SM' },
    { value: 'SL', label: 'API SL' }, { value: 'CF', label: 'API CF' }
  ];

  aceaOptions: SelectOption[] = [
    { value: 'A3/B4', label: 'ACEA A3/B4' }, { value: 'A5/B5', label: 'ACEA A5/B5' },
    { value: 'C2', label: 'ACEA C2' }, { value: 'C3', label: 'ACEA C3' }
  ];

  baseOptions: SelectOption[] = [
    { value: 'Synthétique', label: 'Synthétique' },
    { value: 'Semi-synthétique', label: 'Semi-synthétique' },
    { value: 'Minérale', label: 'Minérale' }
  ];

  brandOptions: SelectOption[] = [
    { value: 'Castrol', label: 'Castrol' },
    { value: 'Shell', label: 'Shell' },
    { value: 'TotalEnergies', label: 'TotalEnergies' },
    { value: 'Motul', label: 'Motul' }
  ];

  capacityOptions: SelectOption[] = [
    { value: '1L', label: '1 Liter' }, { value: '4L', label: '4 Liters' },
    { value: '5L', label: '5 Liters' }, { value: '20L', label: '20 Liters' }
  ];

  equipmentTypeOptions: SelectOption[] = [
    { value: 'Filter', label: 'Filter' }, { value: 'Brakes', label: 'Brakes' },
    { value: 'Battery', label: 'Battery' }, { value: 'Tires', label: 'Tires' }
  ];

  materialOptions: SelectOption[] = [
    { value: 'Aluminum', label: 'Aluminum' }, { value: 'Steel', label: 'Steel' },
    { value: 'Plastic', label: 'Plastic' }
  ];

  dimensionsOptions: SelectOption[] = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Compact', label: 'Compact' },
    { value: 'Large', label: 'Large' },
    { value: 'XL', label: 'Extra Large' }
  ];

  compatibilityOptions: SelectOption[] = [
    { value: 'BMW LL-04', label: 'BMW LL-04' },
    { value: 'MB 229.51', label: 'MB 229.51' },
    { value: 'VW 504 00/507 00', label: 'VW 504 00/507 00' },
    { value: 'Porsche C30', label: 'Porsche C30' }
  ];

  advantageOptions: SelectOption[] = [
    { value: 'Protection extrême', label: 'Protection extrême' },
    { value: 'Économie de carburant', label: 'Économie de carburant' },
    { value: 'Réduction des émissions', label: 'Réduction des émissions' }
  ];

  applicationOptions: SelectOption[] = [
    { value: 'Moteurs Essence', label: 'Moteurs Essence' },
    { value: 'Moteurs Diesel', label: 'Moteurs Diesel' },
    { value: 'Turbo compressé', label: 'Turbo compressé' }
  ];

  getValueOptions(key: string): SelectOption[] | null {
    switch (key) {
      case 'Viscosité': return this.viscosityOptions;
      case 'API': return this.apiOptions;
      case 'ACEA': return this.aceaOptions;
      case 'Base': return this.baseOptions;
      case 'Contenance': return this.capacityOptions;
      case 'Type': return this.equipmentTypeOptions;
      case 'Matériau': return this.materialOptions;
      case 'Dimensions': return this.dimensionsOptions;
      case 'Compatibilité constructeur': return this.compatibilityOptions;
      case 'Avantages': return this.advantageOptions;
      case 'Applications': return this.applicationOptions;
      default: return null;
    }
  }

  getAvailableSpecKeys(currentIndex: number): SelectOption[] {
    const allKeys = this.commonSpecKeys;
    const selectedKeys = this.specifications.controls
      .map((ctrl, i) => i !== currentIndex ? ctrl.get('key')?.value : null)
      .filter(k => k !== null);
    
    return allKeys.filter(opt => !selectedKeys.includes(opt.value));
  }

  get canAddSpecification(): boolean {
    return this.getAvailableSpecKeys(-1).length > 0;
  }

  get commonSpecKeys(): SelectOption[] {
    const cat = this.productForm?.get('category')?.value;
    return cat === 'oil' ? this.oilSpecKeys : this.equipmentSpecKeys;
  }

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
      brand: [''],
      carType: [[]],
      specifications: this.fb.array([])
    });

    // Category changes clear specs to avoid mixing Oil/Equipment data
    this.productForm.get('category')?.valueChanges.subscribe(() => {
      this.specifications.clear();
    });
  }

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  prePopulateSpecs(category: string) {
    this.specifications.clear();
    const keys = category === 'oil' ? this.oilSpecKeys : this.equipmentSpecKeys;
    keys.forEach(k => {
      this.addSpecificationWith(k.value, '');
    });
  }

  addSpecification() {
    this.addSpecificationWith('', '');
    // Scroll to bottom after adding
    setTimeout(() => {
      if (this.specContainer) {
        const el = this.specContainer.nativeElement;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }

  addSpecificationWith(key: string, value: string) {
    this.specifications.push(this.fb.group({
      key: [key, Validators.required],
      value: [value]
    }));
  }

  removeSpecification(index: number) {
    this.specifications.removeAt(index);
  }

  loadProduct() {
     if (!this.productId) return;
     this.productService.getProductById(this.productId).subscribe(product => {
       this.productForm.patchValue({
         name: product.name,
         price: product.price,
         quantity: product.quantity,
         volume: product.volume,
         category: product.category,
         supplier: product.supplier,
         brand: product.specifications?.['Marque'] || '',
         carType: product.carType || []
       });

       this.specifications.clear();
       if (product.specifications) {
         Object.keys(product.specifications).forEach(key => {
           if (key !== 'Marque') {
             this.addSpecificationWith(key, product.specifications[key]);
           }
         });
       }

       this.uploadedImageUrl = product.urlImage ?? null;
     });
  }

  onFileDropped(files: File[]) {
    if (files.length > 0) {
      const file = files[0];
      this.loading = true;
      this.productService.uploadImage(file).subscribe({
        next: (res) => {
          this.uploadedImageUrl = res.path ?? null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error uploading image', err);
          this.loading = false;
        }
      });
    }
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

  onCarTypeChangeManual(value: string) {
    let currentTypes = this.productForm.get('carType')?.value as string[];
    if (!currentTypes) currentTypes = [];

    if (currentTypes.includes(value)) {
      this.productForm.get('carType')?.setValue(currentTypes.filter(t => t !== value));
    } else {
      this.productForm.get('carType')?.setValue([...currentTypes, value]);
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

    // Collect specifications from FormArray
    const specificationsHash: { [key: string]: string } = {};
    if (formValues.brand) {
      specificationsHash['Marque'] = formValues.brand;
    }
    
    formValues.specifications.forEach((spec: { key: string, value: string }) => {
      if (spec.key && spec.value) {
        specificationsHash[spec.key] = spec.value;
      }
    });

    const payload = {
      ...formValues,
      category: formValues.category,
      specifications: specificationsHash,
      urlImage: this.uploadedImageUrl || ''
    };

    // Clean up UI-only field
    delete (payload as any).specifications;
    delete (payload as any).brand;

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
      this.productService.createProduct(payload).subscribe({
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
