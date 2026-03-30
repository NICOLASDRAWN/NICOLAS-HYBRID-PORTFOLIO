import React, { useState, useEffect, FC, ReactNode, useRef, useMemo } from 'react';
import { useDb } from '../store/db';
import { motion, AnimatePresence } from 'framer-motion';
import { PurchaseOrder, Supplier, POItem, Product, ProductType, OrderStatus, OCCStatus } from '../types';
import {
  LayoutDashboard, FilePlus, Settings, ShoppingCart, User, ChevronRight, ChevronLeft,
  PieChart, PackageSearch, Truck, LogOut, Layers, Menu, X, Bell,
  ChevronDown, Sparkles, Calendar, FileText, LayoutGrid, CheckCircle,
  ArrowLeft, Clock, RefreshCw, FileCheck, Printer, ArrowRight,
  Trash2, Plus, GripVertical, AlertCircle, File, Search, Filter,
  TrendingUp, Send, ExternalLink, Box, AlertTriangle, Package, Download, Edit2, Tag, Upload, Star, Hash, Eye, DollarSign,
  FileSpreadsheet, FileImage, ShieldCheck, Activity
} from 'lucide-react';
import { MIPLogo } from '../components/MIPLogo';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { SearchableSelect } from '../components/SearchableSelect';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const CreateOrder: FC = () => {
  const {
    suppliers, products, createOrder, updateOrder, orders, updateOrderStatus, settings, currentUser,
    requestChange, approveChange, users, inventoryItems, warehouses, costCenters,
    addSupplier, addProduct, reserveSequence, uploadFile, isLoaded, approveByBudget, approveByPurchasing, approveOrder, sendEmailNotification
  } = useDb();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  // Basic Order State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const totalSteps = 4;
  const [step, setStep] = useState<'edit' | 'preview'>('edit');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [items, setItems] = useState<POItem[]>([]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<PurchaseOrder['status']>('Draft');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [paymentType, setPaymentType] = useState<'Credit' | 'Advance'>('Credit');
  const [advancePct, setAdvancePct] = useState<number>(0.5);
  const [reservedSequence, setReservedSequence] = useState<number | null>(null);
  const [comments, setComments] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldSendToApproval, setShouldSendToApproval] = useState(false);
  const orderRef = useRef<HTMLDivElement>(null);

  // AIU States
  const [aiuEnabled, setAiuEnabled] = useState(false);
  const [aiuAdmin, setAiuAdmin] = useState(10);
  const [aiuImprevistos, setAiuImprevistos] = useState(5);
  const [aiuUtilidad, setAiuUtilidad] = useState(5);

  // OCC Status
  const [occStatus, setOccStatus] = useState<'Pendiente' | 'EnProceso' | 'Entregado'>('Pendiente');

  // Documents
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; url: string; uploadedAt: string }>>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Double Approval Local States (for display in preview)
  const [budgetApproved, setBudgetApproved] = useState(false);
  const [approvedByBudget, setApprovedByBudget] = useState('');
  const [budgetSignatureUrl, setBudgetSignatureUrl] = useState('');
  const [purchasingApproved, setPurchasingApproved] = useState(false);
  const [approvedByPurchasing, setApprovedByPurchasing] = useState('');
  const [purchasingSignatureUrl, setPurchasingSignatureUrl] = useState('');
  const [elaboratedByName, setElaboratedByName] = useState<string>('');
  const [approverSignatureUrl, setApproverSignatureUrl] = useState<string>('');
  const [approvedBy, setApprovedBy] = useState<string>('');

  // Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState(false);
  const [changeReasonInput, setChangeReasonInput] = useState('');
  const [targetApproverId, setTargetApproverId] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [requesterSignatureUrl, setRequesterSignatureUrl] = useState('');

  const [selectedApproverIds, setSelectedApproverIds] = useState<string[]>([]);
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);

  // New Forms State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', code: '', unitPrice: 0, unit: 'UNIDAD - UND', category: 'General', type: 'Producto' });
  const [newSupplier, setNewSupplier] = useState({ name: '', taxId: '', email: '', phone: '' });
  const [newComment, setNewComment] = useState('');

  const previewSequence = useMemo(() => {
    return orders.find((o: PurchaseOrder) => o.id === currentOrderId)?.sequenceNumber || settings.nextSequenceNumber;
  }, [orders, currentOrderId, settings.nextSequenceNumber]);

  const canEdit = currentUser?.permissions?.orders_edit ?? (currentUser?.role === 'Admin' || currentUser?.role === 'Approver' || currentUser?.role === 'Buyer');
  const canApprove = currentUser?.permissions?.orders_approve ?? (currentUser?.role === 'Approver' || currentUser?.role === 'Admin');
  const isBuyer = currentUser?.role === 'Buyer';
  const isAdmin = currentUser?.role === 'Admin';
  const isApprover = currentUser?.role === 'Approver';
  const isViewer = currentUser?.role === 'Viewer';
  const currentOrder = orders.find(o => o.id === currentOrderId);
  const isRequester = currentOrder?.requestedById === currentUser?.id;
  const isOwner = !currentOrderId || isRequester;

  const isCurrentlyEditable = (canEdit && (isOwner || isAdmin || isBuyer) && (orderStatus === 'Draft' || orderStatus === 'InProcess' || !orderStatus)) ||
    (orderStatus === 'ApprovedForChange' && (isAdmin || isBuyer || isOwner)) ||
    (orderStatus === 'ChangeRequested' && (isAdmin || isBuyer || isOwner));

  const canAuthorizeThisChange = isAdmin || (isApprover && currentOrder?.requestedApproverId === currentUser?.id);

  const currentSupplier = useMemo(() => suppliers.find(s => s.id === selectedSupplierId), [suppliers, selectedSupplierId]);

  const availableProducts = useMemo(() => {
    if (!searchTerm && selectedSupplierId) {
      return products.filter(p => p.supplierId === selectedSupplierId).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 50);
    }
    if (!searchTerm) return [];
    const lower = searchTerm.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lower) || p.code.toLowerCase().includes(lower))
      .sort((a, b) => {
        if (a.supplierId === selectedSupplierId && b.supplierId !== selectedSupplierId) return -1;
        if (a.supplierId !== selectedSupplierId && b.supplierId === selectedSupplierId) return 1;
        return a.name.localeCompare(b.name);
      }).slice(0, 50);
  }, [products, selectedSupplierId, searchTerm]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    let aiuValue = 0;
    const aiuPctSum = aiuEnabled ? (Number(aiuAdmin) + Number(aiuImprevistos) + Number(aiuUtilidad)) : 0;

    items.forEach(item => {
      const itemSub = item.quantity * item.unitPrice;
      subtotal += itemSub;
      
      const itemAiu = (itemSub * aiuPctSum) / 100;
      aiuValue += itemAiu;

      const baseGravable = aiuEnabled ? itemAiu : itemSub;
      const effectiveRate = item.taxRate === 'custom' ? (item.customTaxRate || 0) / 100 : item.taxRate;
      tax += (Number(baseGravable) * Number(effectiveRate));
    });

    const total = subtotal + tax; // AIU is already in subtotal, only add Tax
    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      aiuPct: aiuPctSum,
      aiuValue: Number(aiuValue.toFixed(2))
    };
  }, [items, aiuEnabled, aiuAdmin, aiuImprevistos, aiuUtilidad]);

  // Sync item.total whenever AIU globally changes
  useEffect(() => {
    if (!isCurrentlyEditable || items.length === 0) return;
    let changed = false;
    const newItems = items.map(item => {
      const q = typeof item.quantity === 'string' ? parseFloat(String(item.quantity).replace(/,/g, '.')) : item.quantity;
      const p = typeof item.unitPrice === 'string' ? parseFloat(String(item.unitPrice).replace(/,/g, '.')) : item.unitPrice;
      const r = item.taxRate === 'custom' ? (item.customTaxRate || 0) / 100 : (typeof item.taxRate === 'string' ? parseFloat(String(item.taxRate).replace(/,/g, '.')) : item.taxRate);
      
      const itemSub = q * p;
      const aiuPct = aiuEnabled ? (Number(aiuAdmin) + Number(aiuImprevistos) + Number(aiuUtilidad)) / 100 : 0;
      const itemAiu = itemSub * aiuPct;
      const base = aiuEnabled ? itemAiu : itemSub;
      
      // If aiuEnabled: itemSub + (itemAiu * rate)
      // If !aiuEnabled: itemSub * (1 + rate)
      const calculatedTotal = aiuEnabled ? (itemSub + (itemAiu * Number(r))) : (itemSub * (1 + Number(r)));
      
      if (Math.abs((item.total || 0) - calculatedTotal) > 0.01) {
        changed = true;
        return { ...item, total: calculatedTotal };
      }
      return item;
    });

    if (changed) {
      setItems(newItems);
    }
  }, [aiuEnabled, aiuAdmin, aiuImprevistos, aiuUtilidad]);

  // Persistence Recovery
  useEffect(() => {
    if (!currentOrderId && isLoaded) {
      const saved = localStorage.getItem('mip_draft_recovery');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.items?.length > 0 || data.supplierId) {
            if (window.confirm("Se ha encontrado un borrador anterior no guardado. ¿Desea recuperarlo?")) {
              setSelectedSupplierId(data.supplierId || '');
              setItems(data.items || []);
              setOrderDate(data.date || new Date().toISOString().split('T')[0]);
            }
            localStorage.removeItem('mip_draft_recovery');
          }
        } catch (e) { }
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!currentOrderId && (items.length > 0 || selectedSupplierId)) {
      const timer = setTimeout(() => {
        localStorage.setItem('mip_draft_recovery', JSON.stringify({ items, supplierId: selectedSupplierId, date: orderDate }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [items, selectedSupplierId, orderDate]);

  // Load effect
  useEffect(() => {
    if (orderId && isLoaded) {
      const existingOrder = orders.find(o => o.id === orderId);
      if (existingOrder) {
        setSelectedSupplierId(existingOrder.supplierId);
        setItems(existingOrder.items);
        if (existingOrder.sequenceNumber) setReservedSequence(existingOrder.sequenceNumber);
        setOccStatus(existingOrder.occStatus || 'Pendiente');
        setOrderDate(existingOrder.date);
        setOrderStatus(existingOrder.status);
        setPaymentType(existingOrder.paymentType || 'Credit');
        if (existingOrder.advancePercentage) setAdvancePct(existingOrder.advancePercentage);
        setComments(existingOrder.comments || '');
        setQuoteNumber(existingOrder.quoteNumber || '');
        setCurrentOrderId(existingOrder.id);
        setApprovedBy(existingOrder.approvedBy || '');
        setApproverSignatureUrl(existingOrder.approverSignatureUrl || '');
        setChangeReasonInput(existingOrder.changeReason || '');
        setElaboratedByName(existingOrder.requestedByName || '');
        setBudgetApproved(!!existingOrder.budgetApproved);
        setApprovedByBudget(existingOrder.approvedByBudget || '');
        setBudgetSignatureUrl(existingOrder.budgetSignatureUrl || '');
        setPurchasingApproved(!!existingOrder.purchasingApproved);
        setApprovedByPurchasing(existingOrder.approvedByPurchasing || '');
        setPurchasingSignatureUrl(existingOrder.purchasingSignatureUrl || '');
        setDocuments(existingOrder.documents || []);
        if (existingOrder.requesterSignatureUrl) setRequesterSignatureUrl(existingOrder.requesterSignatureUrl);
        
        // Recover AIU Settings
        setAiuEnabled(!!existingOrder.aiuEnabled);
        if (existingOrder.aiuAdministracion !== undefined) setAiuAdmin(existingOrder.aiuAdministracion);
        if (existingOrder.aiuImprevistos !== undefined) setAiuImprevistos(existingOrder.aiuImprevistos);
        if (existingOrder.aiuUtilidad !== undefined) setAiuUtilidad(existingOrder.aiuUtilidad);

        if (searchParams.get('view') === 'pdf') {
          setWizardStep(4); setStep('preview');
        } else {
          setWizardStep(3);
        }
      }
    } else if (isLoaded && !orderId && currentUser) {
      // NEW ORDER initialization
      setElaboratedByName(currentUser.name || '');
      setRequesterSignatureUrl(currentUser.signatureUrl || '');
    }
  }, [orderId, orders, isLoaded, currentUser]);

  // Permission Check: Prevent approvers from creating new orders
  useEffect(() => {
    if (isLoaded && !orderId && currentUser && !currentUser.permissions?.orders_create && currentUser.role !== 'Admin') {
      toast.error("Tu rol no permite la creación de nuevas órdenes de compra");
      navigate('/dashboard');
    }
  }, [isLoaded, orderId, currentUser, navigate]);

  const handleDownloadPDF = async () => {
    if (!orderRef.current) return;
    setIsGeneratingPDF(true);
    const toastId = toast.loading("Generando documento con firmas...");
    try {
      document.body.classList.add('printing-mode');

      // Wait for all images inside the printable area to fully load (critical for signatures)
      const images = Array.from(orderRef.current.querySelectorAll('img'));
      await Promise.all(
        images.map(img =>
          new Promise<void>(resolve => {
            if (img.complete && img.naturalWidth > 0) { resolve(); return; }
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Don't block on broken images
            // Force reload if needed for CORS
            if (img.src && !img.src.startsWith('data:')) {
              const sep = img.src.includes('?') ? '&' : '?';
              img.src = img.src + sep + '_t=' + Date.now();
            }
          })
        )
      );

      // Extra buffer for render
      await new Promise(r => setTimeout(r, 800));

      const element = orderRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        // Capture full scrollable height
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      document.body.classList.remove('printing-mode');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pageWidth = pdf.internal.pageSize.getWidth();   // 215.9 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 279.4 mm

      // Calculate the rendered image height in mm
      const imgWidthMm = pageWidth;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      // Smart Scaling: If it's slightly over one page (up to 25%), scale it down to fit in ONE page.
      const scaleToFitThreshold = 1.25;

      if (imgHeightMm <= pageHeight * scaleToFitThreshold) {
        // Fits in one page (scaled if necessary)
        const finalImgHeight = Math.min(imgHeightMm, pageHeight);
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, finalImgHeight);
      } else {
        // Multi-page: Intelligent slicing
        const scale = 2; // Match the scale used in html2canvas
        const pageHeightPx = (canvas.width * pageHeight) / imgWidthMm;

        // Find best break points in DOM
        const containerRect = element.getBoundingClientRect();
        const breakPoints = Array.from(element.querySelectorAll('tr, .grid, .keep-together, .signature-block, .totals-block'))
          .map(el => (el.getBoundingClientRect().bottom - containerRect.top) * scale)
          .sort((a, b) => a - b);

        let yOffset = 0;
        let pageNum = 0;

        while (yOffset < canvas.height) {
          const remainingHeight = canvas.height - yOffset;
          let targetY = yOffset + pageHeightPx;
          let sliceH = Math.min(pageHeightPx, remainingHeight);

          // Find the highest breakpoint that is still within the current page limit
          if (remainingHeight > pageHeightPx) {
            const bestBreak = [...breakPoints].reverse().find(p => p <= targetY && p > yOffset + (pageHeightPx * 0.6));
            if (bestBreak) {
              sliceH = bestBreak - yOffset;
            } else if (remainingHeight < pageHeightPx * 1.25) {
              // If no good breakpoint and we are near the end, split evenly
              sliceH = remainingHeight / 2;
            }
          }

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceH;
          const ctx = pageCanvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

          const sliceData = pageCanvas.toDataURL('image/png');
          const sliceHeightMm = (sliceH * imgWidthMm) / canvas.width;

          if (pageNum > 0) pdf.addPage();
          pdf.addImage(sliceData, 'PNG', 0, 0, imgWidthMm, sliceHeightMm);

          yOffset += sliceH;
          pageNum++;

          if (sliceH <= 0 || pageNum > 20) break; // Safety break
        }
      }

      const fileName = `Orden_MIP_${previewSequence ? String(previewSequence).padStart(3, '0') : 'TEMP'}.pdf`;
      pdf.save(fileName);

      // Archive in system
      try {
        const pdfBlob = pdf.output('blob');
        const pdfFile = new (window as any).File([pdfBlob], fileName, { type: 'application/pdf' });
        const fileUrl = await uploadFile(pdfFile, 'documents');
        if (fileUrl && currentOrderId) {
          const newDoc = {
            id: Date.now().toString(),
            name: fileName,
            url: fileUrl,
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser?.name
          };
          const updatedDocs = [...documents, newDoc];
          setDocuments(updatedDocs);
          await updateOrder(currentOrderId, { documents: updatedDocs });
        }
      } catch (_) { /* Archive failure doesn't block the user */ }

      toast.success("✅ PDF generado con firmas incluidas", { id: toastId });
    } catch (e) {
      console.error('PDF error:', e);
      toast.error("Error al generar PDF", { id: toastId });
      document.body.classList.remove('printing-mode');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAddItem = (product: Product) => {
    if (!isCurrentlyEditable) return;
    const newItem: POItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      quantity: 1,
      unitPrice: product.unitPrice,
      taxRate: 0.19,
      total: product.unitPrice,
      unit: product.unit || 'UND'
    };
    setItems([...items, newItem]);
    toast.success("Item agregado");
  };

  const updateItem = (id: string, field: string, value: any) => {
    if (!isCurrentlyEditable) return;
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (['quantity', 'unitPrice', 'taxRate', 'customTaxRate'].includes(field)) {
        const q = field === 'quantity' ? parseFloat(String(value).replace(/,/g, '.')) : item.quantity;
        const p = field === 'unitPrice' ? parseFloat(String(value).replace(/,/g, '.')) : item.unitPrice;
        let r = item.taxRate;
        if (field === 'taxRate') {
          r = (value === 'custom' ? (item.customTaxRate || 0) / 100 : parseFloat(String(value).replace(/,/g, '.')));
        } else if (field === 'customTaxRate') {
          r = parseFloat(String(value).replace(/,/g, '.')) / 100;
        }
        const itemSub = q * p;
        const aiuPct = aiuEnabled ? (Number(aiuAdmin) + Number(aiuImprevistos) + Number(aiuUtilidad)) / 100 : 0;
        const itemAiu = itemSub * aiuPct;
        const base = aiuEnabled ? itemAiu : itemSub;
        updated.total = aiuEnabled ? (itemSub + itemAiu * (typeof r === 'string' ? 0 : r)) : (itemSub * (1 + (typeof r === 'string' ? 0 : r)));
      }

      if (field === 'costCenterId') {
        const cc = costCenters.find(c => c.id === value);
        if (cc) updated.costCenterName = cc.name;
      }

      return updated;
    }));
  };

  const removeItem = (id: string) => {
    if (!isCurrentlyEditable) return;
    setItems(items.filter(i => i.id !== id));
  };

  const goToPrevStep = () => {
    if (wizardStep > 1) setWizardStep((wizardStep - 1) as any);
  };

  const goToNextStep = () => {
    if (wizardStep === 1 && !selectedSupplierId) return toast.error("Seleccione un proveedor");
    if (wizardStep === 2 && items.length === 0) return toast.error("Agregue al menos un item");
    if (wizardStep < 4) setWizardStep((wizardStep + 1) as any);
  };

  const handleSaveOrder = async (isDraft = false) => {
    if (!currentSupplier) return;
    if (isSaving) return;
    setIsSaving(true);
    try {
      let sequence = reservedSequence;
      const status = isDraft ? 'Draft' : 'Pending';
      if (!sequence) {
        console.log("Reserving sequence for order/draft...");
        try {
          sequence = await reserveSequence();
          console.log("Sequence reserved:", sequence);
        } catch (e) {
          console.error("Failed to reserve sequence:", e);
        }
      }

      const orderData: any = {
        supplierId: currentSupplier.id,
        supplierName: currentSupplier.name,
        date: orderDate,
        sequenceNumber: sequence, // Include sequence number in update payload
        items,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        status,
        paymentType,
        advancePercentage: paymentType === 'Advance' ? advancePct : 0,
        paidAmount: paymentType === 'Advance' ? Number((totals.total * advancePct).toFixed(2)) : 0,
        debtAmount: paymentType === 'Advance' ? Number((totals.total * (1 - advancePct)).toFixed(2)) : totals.total,
        quoteNumber,
        comments,
        occStatus,
        aiuEnabled,
        aiuAdministracion: aiuAdmin,
        aiuImprevistos: aiuImprevistos,
        aiuUtilidad: aiuUtilidad,
        aiuTotal: totals.aiuValue,
        documents,
        requestedById: currentOrder?.requestedById || currentUser?.id,
        requestedByName: currentOrder?.requestedByName || currentUser?.name,
        requesterSignatureUrl: currentOrder?.requesterSignatureUrl || currentUser?.signatureUrl,
        // Ensure that only Buyers or Admins are marked as authors
        isElaboratedByApprover: (currentOrder ? currentOrder.isElaboratedByApprover : (currentUser?.role === 'Approver')),
        approvals: selectedApproverIds.map(id => {
          // Preserve existing signatures
          const existing = (currentOrder || orders.find(o => o.id === currentOrderId))?.approvals?.find(a => a.userId === id);
          if (existing) return existing;

          const u = users.find(user => user.id === id);
          return {
            userId: id,
            userName: u?.name || 'Aprobador',
            role: u?.role,
            approved: false
          };
        })
      };

      // Strict check: if the user is an Approver, they cannot create new orders as requester
      if (currentUser?.role === 'Approver' && !currentOrder) {
        toast.error("Un aprobador no puede elaborar órdenes de compra.");
        setIsSaving(false);
        return;
      }

      if (currentOrderId) {
        await updateOrder(currentOrderId, orderData);
        // Update local reserved sequence to prevent re-reserving if clicked again
        if (sequence) setReservedSequence(sequence);
      } else {
        const id = await createOrder({ ...orderData, sequenceNumber: sequence });
        setCurrentOrderId(id);
        if (sequence) setReservedSequence(sequence);
      }
      setOrderStatus(status);
      toast.success(isDraft ? "Borrador guardado" : "Orden enviada a aprobación");
      if (!isDraft) navigate('/dashboard');
      setIsVerifyModalOpen(false);
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleApprover = (id: string) => {
    setSelectedApproverIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleClearOrder = () => {
    if (confirm("¿Limpiar toda la orden?")) {
      setItems([]); setSelectedSupplierId(''); setComments(''); setQuoteNumber(''); setDocuments([]); setWizardStep(1);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentOrderId) return;
    const comment = {
      id: Date.now().toString(),
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.name || 'Anónimo',
      text: newComment,
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [...(currentOrder?.commentsHistory || []), comment];
    await updateOrder(currentOrderId, { commentsHistory: updatedHistory });
    setNewComment('');
    toast.success("Comentario agregado");
  };

  const handleUpdateLogistics = async (val: string) => {
    setOccStatus(val as any);
    if (currentOrderId) {
      await updateOrder(currentOrderId, { occStatus: val as any });
      toast.success("Estado de logística actualizado");
    }
  };

  const handleApprove = async () => {
    if (!currentOrderId) return;
    await approveOrder(currentOrderId);
  };

  const handleReject = async () => {
    if (!currentOrderId) return;
    const reason = prompt("Razón del rechazo:");
    if (reason) {
      await updateOrder(currentOrderId, { status: 'ChangeRequested', changeReason: reason });
      navigate('/dashboard');
    }
  };

  // Rendering
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="w-12 h-12 text-blue-600 animate-spin" /></div>;

  if (step === 'preview' && currentSupplier) {
    return (
      <div className="min-h-screen bg-slate-100/50 pb-24 pt-8 animate-in fade-in duration-500">
        {/* Floating Toolbar */}
        <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[210mm] px-4 no-print">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl p-2 md:p-3 flex justify-between items-center ring-1 ring-black/5">
            <div className="flex gap-2">
              <button onClick={() => navigate('/')} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Panel</button>
              {isCurrentlyEditable && <button onClick={() => setStep('edit')} className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-black text-[10px] uppercase tracking-widest">Editar</button>}
            </div>
            <div className="flex gap-1.5 md:gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                disabled={isGeneratingPDF}
              >
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> PDF
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" /> Imprimir
              </button>

              {canApprove && currentOrder?.status === 'Pending' && (
                (() => {
                  const name = currentUser?.name.toLowerCase() || '';
                  const isBudget = name.includes('magdaly');
                  const isPurchasing = name.includes('maria alejandra');

                  // Don't show if already approved by this specific approver
                  if (isBudget && currentOrder.budgetApproved) return null;
                  if (isPurchasing && currentOrder.purchasingApproved) return null;

                  return (
                    <>
                      <button onClick={handleApprove} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20"><CheckCircle className="w-4 h-4" /> Aprobar</button>
                      <button onClick={handleReject} className="px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-500/20"><X className="w-4 h-4" /> Rechazar</button>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        <div ref={orderRef} className="printable-order bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl border border-slate-200 print:shadow-none print:border-0 relative p-[4mm] text-black">
          {/* Header Section (Img Ref: Header Layout) */}
          <div className="grid grid-cols-[1.5fr_3fr_1.5fr] border border-black mb-1">
            <div className="p-2 border-r border-black flex items-center justify-center">
              {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-16 object-contain" alt="Logo" /> : <div className="text-xl font-black">MIP</div>}
            </div>
            <div className="p-2 border-r border-black flex flex-col items-center justify-center text-center">
              <h1 className="font-black text-xl uppercase leading-none mb-0.5">{settings.companyName}</h1>
              <p className="text-[8px] font-bold">NIT: {settings.companyTaxId}</p>
              <p className="text-[8px] font-medium leading-tight">{settings.companyAddress} · Bogotá D.C., Colombia</p>
            </div>
            <div className="flex flex-col font-black">
              <div className="border-b border-black text-center py-1 text-[8px] tracking-widest uppercase">ORDEN DE COMPRA</div>
              <div className="flex-1 flex flex-col items-center justify-center p-1">
                <span className="text-2xl text-[#10b981] font-black leading-none">MIP{String(previewSequence).padStart(3, '0')}</span>
                <div className="mt-1 flex flex-col items-center text-[5.5px] leading-tight font-bold text-slate-500">
                  <span>Código CO-F-11</span>
                  <span>Versión :1</span>
                  <span>Fecha 07/06/2025</span>
                </div>
              </div>
              <div className="border-t border-black px-2 py-0.5 flex justify-between items-center text-[6.5px]">
                <span>FECHA: {orderDate}</span>
                <span className="text-blue-500 font-bold italic">v3.1</span>
              </div>
            </div>
          </div>

          {/* Supplier and Controls Info */}
          <div className="grid grid-cols-[3.5fr_2.5fr] border border-black border-t-0 mb-1 text-[8px]">
            <div className="p-2 border-r border-black grid grid-cols-[80px_1fr] gap-y-0.5">
              <span className="font-black uppercase">SEÑORES:</span> <span className="uppercase font-bold">{currentSupplier.name}</span>
              <span className="font-black uppercase">NIT/RUC:</span> <span>{currentSupplier.taxId}</span>
              <span className="font-black uppercase">DIRECCIÓN:</span> <span className="uppercase">{currentSupplier.address}</span>
              <span className="font-black uppercase">TELÉFONO:</span> <span>{currentSupplier.phone}</span>
            </div>
            <div className="p-2 grid grid-cols-1 gap-y-0.5">
              <div className="font-black border-b border-black/10 pb-0.5 mb-0.5 tracking-widest uppercase text-[7px]">DATOS DE CONTROL</div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase">FORMA DE PAGO:</span>
                <span className="uppercase font-bold">{paymentType === 'Credit' ? 'PAGO A CRÉDITO' : `ANTICIPADO (${Math.round(advancePct * 100)}%)`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase">Nº COTIZACIÓN:</span>
                <span className="font-bold">{quoteNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <table className="w-full border-collapse border border-black mb-1 text-[7px]">
            <thead>
              <tr className="bg-[#ecfdf5] border-b border-black font-black uppercase text-center text-[6.5px] h-6">
                <th className="border-r border-black p-0.5 w-[5%]">CANT</th>
                <th className="border-r border-black p-0.5 w-[7%]">UND</th>
                <th className="border-r border-black p-0.5 text-left px-2">DESCRIPCIÓN</th>
                <th className="border-r border-black p-0.5 w-[15%] px-1 text-[6px]">C. COSTO</th>
                <th className="border-r border-black p-0.5 w-[12%]">V. UNITARIO</th>
                <th className="border-r border-black p-0.5 w-[12%]">V. TOTAL NETO</th>
                {aiuEnabled && <th className="border-r border-black p-0.5 w-[5%]">A.I.U</th>}
                <th className="border-r border-black p-0.5 w-[5%]">IVA</th>
                <th className="p-0.5 w-[12%]">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map(i => (
                <tr key={i.id} className="min-h-[22px]">
                  <td className="border-r border-black/10 p-0.5 text-center font-bold">{i.quantity}</td>
                  <td className="border-r border-black/10 p-0.5 text-center uppercase font-medium">{i.unit || 'UND'}</td>
                  <td className="border-r border-black/10 p-0.5 px-2 font-bold uppercase text-[7px] leading-tight w-[30%]">
                    {i.productName}
                  </td>
                  <td className="border-r border-black/10 p-0.5 px-1 text-center text-[5.5px] font-black uppercase flex flex-col justify-center min-h-[26px]">
                    <span className="text-blue-600 mb-0.5">{i.costCenterId ? i.costCenterId.split('-')[0] : ''}</span>
                    <span className="leading-[1]">{i.costCenterName || 'GENERAL'}</span>
                  </td>
                  <td className="border-r border-black/10 p-0.5 text-right font-mono">$ {Number(i.unitPrice).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                  <td className="border-r border-black/10 p-0.5 text-right font-mono font-bold">$ {Number(i.quantity * i.unitPrice).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                  {aiuEnabled && <td className="border-r border-black/10 p-0.5 text-center font-black">{(aiuAdmin + aiuImprevistos + aiuUtilidad)}%</td>}
                  <td className="border-r border-black/10 p-0.5 text-center font-black">{(Number(i.taxRate === 'custom' ? (i.customTaxRate || 0) / 100 : i.taxRate) * 100)}%</td>
                  <td className="p-0.5 text-right font-black font-mono">$ {Number(i.total).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {/* Spacer rows */}
              {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="h-5">
                  <td className="border-r border-black/10"></td>
                  <td className="border-r border-black/10"></td>
                  <td className="border-r border-black/10"></td>
                  <td className="border-r border-black/10"></td>
                  <td className="border-r border-black/10"></td>
                  <td className="border-r border-black/10"></td>
                  {aiuEnabled && <td className="border-r border-black/10"></td>}
                  <td className="border-r border-black/10"></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="keep-together pt-1">
            <div className="totals-and-signatures totals-block">
              {/* Observations and Totals Column */}
              <div className="grid grid-cols-[1fr_200px] border border-black mb-1">
                <div className="p-2 border-r border-black flex flex-col justify-start min-h-[50px]">
                  <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest mb-1">OBSERVACIONES:</span>
                  <p className="text-[8px] font-bold uppercase italic text-black/80 leading-tight">{comments || 'Sin observaciones.'}</p>
                </div>
                <div className="bg-slate-50 text-[7.5px]">
                  <div className="flex justify-between p-1 border-b border-black">
                    <span className="font-black text-slate-500">SUBTOTAL:</span>
                    <span className="font-mono font-black">$ {totals.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  </div>
                  {aiuEnabled && (
                    <div className="p-1 border-b border-black bg-slate-100 text-[6.5px]">
                      <div className="flex justify-between mb-0.5">
                        <span className="font-bold text-slate-500 italic">ADMINISTRACIÓN ({aiuAdmin}%):</span>
                        <span className="text-slate-400 font-mono italic">$ {Number(totals.subtotal * aiuAdmin / 100).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-bold text-slate-500 italic">IMPREVISTOS ({aiuImprevistos}%):</span>
                        <span className="text-slate-400 font-mono italic">$ {Number(totals.subtotal * aiuImprevistos / 100).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-bold text-slate-500 italic">UTILIDAD ({aiuUtilidad}%):</span>
                        <span className="text-slate-400 font-mono italic">$ {Number(totals.subtotal * aiuUtilidad / 100).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between pt-0.5 border-t border-black/20 mt-0.5">
                        <span className="font-bold text-slate-600 uppercase">BASE GRAVABLE A.I.U. (INCLUIDA):</span>
                        <span className="font-bold"> $ {Number(totals.aiuValue).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between p-1 border-b border-black">
                    <span className="font-black text-slate-500">I.V.A.:</span>
                    <span className="font-mono font-black">$ {totals.tax.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between p-1 bg-black text-white">
                    <span className="font-black text-[8px]">TOTAL ORDEN:</span>
                    <span className="font-mono font-black text-[9px]">$ {totals.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                  </div>
                  {paymentType === 'Advance' && (
                    <div className="bg-amber-50 p-0.5 border-t border-black text-[6.5px]">
                      <div className="flex justify-between">
                        <span>ANTICIPO ({Math.round(advancePct * 100)}%):</span>
                        <span className="font-black">$ {Number(totals.total * advancePct).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fine Print / Requirements */}
              <div className="border border-black p-1.5 mb-2">
                <h4 className="text-[7.5px] font-black underline mb-1 uppercase tracking-tighter">REQUISITOS FACTURACIÓN:</h4>
                <ol className="text-[7px] space-y-0.5 list-decimal list-inside font-medium leading-[1.1] text-black/70">
                  <li>Factura a: <span className="font-black text-black">MIP INTERNACIONAL TRADING SAS</span> · NIT: <span className="font-black text-black">901.165.028-2</span></li>
                  <li>Anexar ficha técnica y certificado de seguridad (HDS) si aplica.</li>
                  <li>Cumplir resolución DIAN (Régimen, NIT Impresor, Códigos ICA).</li>
                  <li>Plazo crédito desde radicación efectiva. Radicación: <span className="text-blue-600 font-bold underline">901165028@recepciondefacturas.co</span></li>
                </ol>
              </div>

              {/* Approval stamp overlay when approved */}
              {(currentOrder?.status === 'Approved' || orderStatus === 'Approved') && (
                <div className="flex justify-end mb-1">
                  <div className="border-2 border-emerald-600 rounded px-3 py-1 rotate-[-4deg] inline-block">
                    <p className="text-emerald-700 font-black text-[14px] uppercase tracking-widest leading-none">Aprobado</p>
                    <p className="text-emerald-600 text-[6.5px] font-bold text-center tracking-widest">
                      {currentOrder?.approvedAt ? new Date(currentOrder.approvedAt).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════ SIGNATURE BLOCK — Dynamic + Legacy ══════════ */}
              <div className="signature-block">
                {currentOrder?.approvals && currentOrder.approvals.length > 0 ? (
                  (() => {
                    const seen = new Set();
                    const uniqueApprovals = currentOrder.approvals.filter(a => {
                      if (!a.userName) return false;

                      const nameKey = a.userName.toLowerCase().replace(/\s+/g, '').trim();
                      const sigKey = a.signatureUrl ? a.signatureUrl.trim() : '';

                      // If seen name OR seen exact signature URL, it's a duplicate
                      if (seen.has(nameKey) || (sigKey && seen.has(sigKey))) return false;

                      seen.add(nameKey);
                      if (sigKey) seen.add(sigKey);
                      return true;
                    });

                    return (
                      <div
                        className={`grid gap-2 px-2 mb-2`}
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(
                            uniqueApprovals.length + 1,
                            4
                          )}, minmax(0, 1fr))`,
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-10 flex items-end mb-1">
                            {requesterSignatureUrl && (
                              <img
                                src={requesterSignatureUrl}
                                className="max-h-full max-w-full object-contain"
                                alt="Firma Elaborado"
                                crossOrigin="anonymous"
                              />
                            )}
                          </div>
                          <div className="w-full h-[0.5px] bg-black mb-1" />
                          <p className="font-black text-[8px] uppercase tracking-tighter">ELABORADO POR (COMPRAS)</p>
                          <p className="text-[7.5px] font-bold text-slate-500 uppercase">{elaboratedByName}</p>
                        </div>

                        {/* One column per unique approver */}
                        {uniqueApprovals.map((approver, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="h-10 flex items-end mb-1 relative">
                              {approver.approved && approver.signatureUrl ? (
                                <img
                                  src={approver.signatureUrl}
                                  className="max-h-full max-w-full object-contain"
                                  alt={`Firma ${approver.userName}`}
                                  crossOrigin="anonymous"
                                />
                              ) : approver.approved ? (
                                <div className="border-2 border-emerald-600 rounded px-2 py-0.5">
                                  <p className="text-emerald-700 font-black text-[7px] uppercase">Firmado</p>
                                </div>
                              ) : (
                                <div className="italic text-slate-300 text-[7px]">Pte. Firma</div>
                              )}
                            </div>
                            <div className="w-full h-[0.5px] bg-black mb-1" />
                            <p className="font-black text-[8px] uppercase tracking-tighter">
                              {(() => {
                                const n = approver.userName.toLowerCase();
                                if (n.includes('magdaly')) return 'COSTOS Y PRESUPUESTO';
                                if (n.includes('maria alejandra')) return 'APROBADO POR COMPRAS';
                                if (approver.role?.includes('Presupuesto')) return 'COSTOS Y PRESUPUESTO';
                                if (approver.role?.includes('Compras')) return 'APROBADO POR COMPRAS';
                                return approver.role || 'APROBADO POR';
                              })()}
                            </p>
                            <p className="text-[7.5px] font-bold text-slate-500 uppercase">{approver.userName}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  /* ── Legacy 4-column block (when no approvals[] array) ── */
                  <div className="grid grid-cols-3 gap-2 px-2 mb-2">
                    {/* Requester / Elaborado */}
                    <div className="flex flex-col items-center">
                      <div className="h-10 flex items-end mb-1">
                        {requesterSignatureUrl && (
                          <img
                            src={requesterSignatureUrl}
                            className="max-h-full max-w-full object-contain"
                            alt="Firma Elaborado"
                            crossOrigin="anonymous"
                          />
                        )}
                      </div>
                      <div className="w-full h-[0.5px] bg-black mb-1" />
                      <p className="font-black text-[8px] uppercase tracking-tighter">ELABORADO POR (COMPRAS)</p>
                      <p className="text-[7.5px] font-bold text-slate-500 uppercase">{elaboratedByName}</p>
                    </div>

                    {/* Legacy Budget — Show always if approved */}
                    {budgetApproved && (
                      <div className="flex flex-col items-center">
                        <div className="h-10 flex items-end mb-1">
                          {budgetSignatureUrl ? (
                            <img
                              src={budgetSignatureUrl}
                              className="max-h-full max-w-full object-contain"
                              alt="Firma Presupuesto"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="border-2 border-emerald-600 rounded px-2 py-0.5">
                              <p className="text-emerald-700 font-black text-[7px] uppercase">Firmado</p>
                            </div>
                          )}
                        </div>
                        <div className="w-full h-[0.5px] bg-black mb-1" />
                        <p className="font-black text-[8px] uppercase tracking-tighter">COSTOS Y PRESUPUESTO</p>
                        <p className="text-[7.5px] font-bold text-slate-500 uppercase">{approvedByBudget || 'MAGDALY CUESTA'}</p>
                      </div>
                    )}

                    {/* Legacy Purchasing — Show always if approved */}
                    {purchasingApproved && (
                      <div className="flex flex-col items-center">
                        <div className="h-10 flex items-end mb-1">
                          {purchasingSignatureUrl ? (
                            <img
                              src={purchasingSignatureUrl}
                              className="max-h-full max-w-full object-contain"
                              alt="Firma Compras"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="border-2 border-emerald-600 rounded px-2 py-0.5">
                              <p className="text-emerald-700 font-black text-[7px] uppercase">Firmado</p>
                            </div>
                          )}
                        </div>
                        <div className="w-full h-[0.5px] bg-black mb-1" />
                        <p className="font-black text-[8px] uppercase tracking-tighter">APROBADO POR COMPRAS</p>
                        <p className="text-[7.5px] font-bold text-slate-500 uppercase">{approvedByPurchasing || 'MARIA ALEJANDRA ANAYA'}</p>
                      </div>
                    )}

                    {/* Fallback Legacy Approver — ONLY if Budget and Purchasing are not present */}
                    {!budgetApproved && !purchasingApproved && approverSignatureUrl && (
                      <div className="flex flex-col items-center">
                        <div className="h-10 flex items-end mb-1">
                          <img
                            src={approverSignatureUrl}
                            className="max-h-full max-w-full object-contain"
                            alt="Firma Aprobado"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="w-full h-[0.5px] bg-black mb-1" />
                        <p className="font-black text-[8px] uppercase tracking-tighter">APROBADO POR</p>
                        <p className="text-[7.5px] font-bold text-slate-500 uppercase">{approvedBy}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* New: PDF History Section */}
          {
            (currentOrder?.commentsHistory || []).length > 0 && (
              <div className="border border-black p-4 mt-4">
                <h5 className="text-[9px] font-black uppercase mb-3 border-b border-black pb-1">BITÁCORA DE ACTUALIZACIONES:</h5>
                <div className="space-y-4">
                  {currentOrder?.commentsHistory?.map((c, i) => (
                    <div key={i} className="text-[8px] border-b border-black/5 pb-2">
                      <div className="flex justify-between font-black mb-1">
                        <span>{c.userName}</span>
                        <span className="opacity-50">{new Date(c.timestamp).toLocaleString('es-CO')}</span>
                      </div>
                      <p className="text-black/80">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          <div className="mt-8 text-center no-print-footer">
            <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em]">{settings.companyName} - BUSINESS INTELLIGENCE SYSTEM</p>
          </div>
        </div >
      </div >
    );
  }

  return (
    <div className="min-h-screen pb-40 animate-in fade-in duration-700 bg-transparent flex flex-col">
      {/* Wizard Header - Compact & Premium */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 md:pt-10 mb-6 md:mb-12">
        <div className="mb-8 hidden md:block">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />
          ) : (
            <MIPLogo className="h-6" />
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-slate-900 rounded-full" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Order System v4.0</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mobile-h-1">
              Crear <span className="text-blue-600">Orden</span>
            </h1>
          </div>
          <div className="flex bg-white/50 backdrop-blur-xl p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-white shadow-sm ring-1 ring-slate-900/5 overflow-x-auto no-scrollbar max-w-full">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 md:gap-3 px-2.5 md:px-6 py-1 md:py-2.5 rounded-lg md:rounded-xl transition-all whitespace-nowrap ${wizardStep === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
                  <span className={`w-3.5 h-3.5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center text-[7px] md:text-[10px] font-black border transition-colors ${wizardStep === s ? 'bg-blue-600 border-blue-500' : 'bg-slate-50 border-slate-200'}`}>{s}</span>
                  <span className="text-[7.5px] md:text-[10px] font-black uppercase tracking-widest">{['Aliado', 'Items', 'Check', 'Fin'][s - 1]}</span>
                </div>
                {s < 4 && <div className="w-2 md:w-8 h-px bg-slate-200 mx-0.5 md:mx-1 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-40">
        <AnimatePresence mode="wait">
          {/* Step 1: Supplier Selection */}
          {wizardStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-4 gap-8"
            >
              <div className="xl:col-span-3 space-y-4 md:space-y-6">
                <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4 md:mb-8">
                    <div className="space-y-1">
                      <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">Directorio Aliados</h2>
                      <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccione el proveedor</p>
                    </div>
                    <button onClick={() => setIsSupplierModalOpen(true)} title="Nuevo Aliado" className="p-2.5 md:p-4 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Plus className="w-3.5 h-3.5 md:w-5 md:h-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <SearchableSelect options={suppliers.map(s => ({ value: s.id, label: `${s.name} (${s.taxId})` }))} value={selectedSupplierId} onChange={setSelectedSupplierId} placeholder="Escriba nombre o NIT del aliado..." />
                    {currentSupplier && (
                      <div className="p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm"><Truck className="w-6 h-6 text-blue-600" /></div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Razón Social</p>
                                <p className="font-black text-slate-900 text-lg uppercase leading-tight">{currentSupplier.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm"><Hash className="w-6 h-6 text-slate-400" /></div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Identificación</p>
                                <p className="font-bold text-slate-700 uppercase tracking-tighter">{currentSupplier.taxId}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm"><Calendar className="w-6 h-6 text-emerald-600" /></div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fecha Gestión</p>
                                <input type="date" title="Fecha" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1 space-y-4 md:space-y-6">
                <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl sticky top-24">
                  <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-4 md:mb-6" />
                  <h3 className="text-lg md:text-xl font-black mb-1 md:mb-2 uppercase tracking-tighter">Primer Paso</h3>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-6 md:mb-8">Establezca el proveedor para habilitar el catálogo.</p>
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={!selectedSupplierId}
                    title="Continuar a Suministros"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Product Catalog - Two Column PC Layout */}
          {wizardStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-4 gap-8"
            >
              <div className="xl:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-30 bg-[#f8fafc]/80 backdrop-blur-xl py-4 border-b border-slate-100">
                  <button onClick={() => setWizardStep(1)} title="Atrás" className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 transition-all shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input type="text" title="Buscar Item" placeholder="Buscar por nombre o código SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all shadow-sm" />
                  </div>
                  <button onClick={() => setIsProductModalOpen(true)} title="Nuevo Item" className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-lg"><Plus className="w-4 h-4" /> Nuevo</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {availableProducts.map(p => (
                    <motion.div whileHover={{ y: -5 }} key={p.id} className="bg-white rounded-xl md:rounded-[2rem] border border-slate-100 p-2.5 md:p-5 shadow-sm hover:shadow-xl transition-all flex flex-col group mobile-card">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-blue-600 transition-all"><Box className="w-4 h-4 md:w-6 md:h-6 text-slate-300 group-hover:text-white transition-colors" /></div>
                      <div className="mb-2 md:mb-4">
                        <p className="text-[6px] md:text-[7px] font-black text-blue-600 uppercase mb-0.5">{p.category || 'General'}</p>
                        <h4 className="text-[9px] md:text-[10px] font-black text-slate-900 line-clamp-2 uppercase leading-tight h-8">{p.name}</h4>
                      </div>
                      <div className="mt-auto pt-2 md:pt-3 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[8px] md:text-[10px] font-black text-slate-900 font-mono">${Number(p.unitPrice).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                        <button onClick={() => handleAddItem(p)} title="Agregar al Carrito" className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {availableProducts.length === 0 && <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100"><p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Sin resultados</p></div>}
              </div>

              {/* Sticky Cart Summary for Step 2 - Desktop Only */}
              <div className="xl:col-span-1 space-y-6 hidden xl:block">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl sticky top-24 flex flex-col h-[70vh]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-50 pb-4 flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-blue-600" /> Carrito Actual</h3>
                  <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group animate-in slide-in-from-right-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-slate-900 truncate uppercase">{item.productName}</p>
                          <p className="text-[8px] font-black text-blue-600">x{item.quantity} - ${Number(item.total).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} title="Remover" className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    {items.length === 0 && <div className="text-center py-12"><p className="text-[8px] font-black text-slate-300 uppercase">Sin Suministros</p></div>}
                  </div>
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Subtotal Estimado</p>
                      <p className="text-lg font-black font-mono text-slate-900">${totals.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                    </div>
                    <button
                      onClick={() => setWizardStep(3)}
                      disabled={items.length === 0}
                      title="Revisar Orden"
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-black shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      Revisar Orden <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Checkout (Item List & Extras) - Ultra Compact Grid */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              <div className="xl:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col flex-1">
                  <div className="p-8 bg-slate-950 text-white flex justify-between items-center relative overflow-hidden rounded-t-[2.5rem]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex items-center gap-6 relative z-10">
                      <button onClick={() => setWizardStep(2)} title="Volver" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"><ChevronLeft className="w-5 h-5 text-white" /></button>
                      <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1">Paso 03 / 04</h3>
                        <p className="text-sm font-black uppercase tracking-widest">Revisión de Suministros</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="text-right hidden sm:block">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Resumen Actual</p>
                        <p className="text-[10px] font-black text-white uppercase">{items.length} Referencias</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {items.map(item => (
                      <div key={item.id} className="p-4 md:p-6 flex flex-col xl:grid xl:grid-cols-12 xl:items-center gap-4 hover:bg-slate-50/80 transition-all border-b border-slate-50 last:border-0 relative group focus-within:z-30 focus-within:bg-white focus-within:shadow-2xl focus-within:scale-[1.01] focus-within:ring-1 focus-within:ring-slate-100 rounded-2xl duration-300 origin-center">
                        <div className="xl:col-span-3">
                          <h4 className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase leading-snug truncate" title={item.productName}>{item.productName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[6px] md:text-[7px] font-black text-blue-600 bg-blue-50 px-1 md:px-1.5 py-0.5 rounded uppercase">{item.productCode}</span>
                            <div className="flex items-center gap-1 group/unit">
                              <span className="text-[6px] md:text-[7px] font-black text-slate-400 uppercase">{item.unit || 'UND'}</span>
                              <button
                                onClick={() => {
                                  const newUnit = prompt('Nueva unidad (ej: UND, M, KG):', item.unit || 'UND');
                                  if (newUnit) updateItem(item.id, 'unit', newUnit.toUpperCase());
                                }}
                                className="opacity-0 group-hover/unit:opacity-100 p-0.5 hover:bg-slate-200 rounded transition-all"
                                title="Cambiar Unidad"
                              >
                                <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className={`xl:col-span-8 grid ${aiuEnabled ? 'grid-cols-4 md:grid-cols-7' : 'grid-cols-4 md:grid-cols-6'} gap-2 md:gap-4 items-end`}>
                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase block ml-0.5 text-center">Cant</label>
                            <input type="number" step="any" title="Cantidad" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-center font-black text-[10px] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner" />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase block ml-0.5 text-center">V. Unit</label>
                            <input type="number" step="any" title="Precio Unitario" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', e.target.value)} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-center font-black font-mono text-[9px] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner" />
                          </div>

                          {aiuEnabled && (
                            <div className="space-y-1 hidden md:block">
                              <label className="text-[7px] font-black text-blue-500 uppercase block text-center truncate">AIU %</label>
                              <div className="w-full p-2.5 text-center text-[10px] font-mono font-black text-blue-700 bg-blue-50 rounded-xl shadow-inner">{aiuAdmin + aiuImprevistos + aiuUtilidad}%</div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase block ml-0.5 text-center">IVA</label>
                            <select
                              title="IVA"
                              value={item.taxRate === 'custom' ? 'custom' : item.taxRate}
                              onChange={e => updateItem(item.id, 'taxRate', e.target.value === 'custom' ? 'custom' : e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-[9px] font-black text-center focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner uppercase"
                            >
                              <option value="0">0%</option>
                              <option value="0.05">5%</option>
                              <option value="0.10">10%</option>
                              <option value="0.19">19%</option>
                              <option value="custom">Otro</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase block ml-2">Centro de Costo</label>
                            <SearchableSelect
                              options={costCenters.map(cc => ({ value: cc.id, label: `${cc.code} - ${cc.name}` }))}
                              value={item.costCenterId || ''}
                              onChange={val => updateItem(item.id, 'costCenterId', val)}
                              className="w-full"
                              compact={true}
                              placeholder="Seleccionar C.C..."
                            />
                          </div>

                          <div className="space-y-1 hidden md:block">
                            <label className="text-[7px] font-black text-emerald-600 uppercase block ml-1 text-center">Subtotal</label>
                            <div className="w-full p-2.5 text-center text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 rounded-xl shadow-inner">${Number(item.unitPrice * item.quantity).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                          </div>
                        </div>

                        <div className="xl:col-span-1 flex items-center justify-end">
                          <button onClick={() => removeItem(item.id)} title="Eliminar Item" className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <div className="py-24 text-center text-slate-200 font-black uppercase text-[10px] tracking-widest">Carrito Vacío</div>}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Document Upload Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Documentos Adjuntos</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {documents.map((doc, idx) => (
                        <div key={doc.id || idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-lg transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${doc.name.toLowerCase().endsWith('.pdf') ? 'bg-rose-50 text-rose-500' :
                            doc.name.toLowerCase().match(/\.(xls|xlsx|csv)$/) ? 'bg-emerald-50 text-emerald-500' :
                              doc.name.toLowerCase().match(/\.(doc|docx|txt)$/) ? 'bg-blue-50 text-blue-500' :
                                'bg-purple-50 text-purple-500'
                            }`}>
                            {doc.name.toLowerCase().endsWith('.pdf') ? <FileText className="w-5 h-5" /> :
                              doc.name.toLowerCase().match(/\.(xls|xlsx|csv)$/) ? <FileSpreadsheet className="w-5 h-5" /> :
                                doc.name.toLowerCase().match(/\.(doc|docx|txt)$/) ? <FileText className="w-5 h-5" /> :
                                  <FileImage className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-700 truncate max-w-[150px]" title={doc.name}>{doc.name}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-1">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Ver Documento">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => {
                                if (confirm('¿Eliminar documento?')) {
                                  setDocuments(documents.filter(d => d.id !== doc.id));
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <label className="flex flex-col items-center justify-center gap-2 w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-slate-400 transition-all group">
                        <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-center">Subir <br />Archivo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.png,.jpeg,.xlsx,.xls,.doc,.docx,.md"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const toastId = toast.loading("Subiendo archivo...");
                              try {
                                const url = await uploadFile(file, 'documents');
                                if (url) {
                                  const newDoc = {
                                    id: Date.now().toString(),
                                    name: file.name,
                                    url: url,
                                    uploadedAt: new Date().toISOString(),
                                    uploadedBy: currentUser?.name
                                  };
                                  setDocuments([...documents, newDoc]);
                                  toast.success("Archivo adjuntado", { id: toastId });
                                }
                              } catch (error) {
                                console.error(error);
                                toast.error("Error al subir archivo", { id: toastId });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium italic">* Puede adjuntar cotizaciones, especificaciones técnicas o correos de respaldo.</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-2xl space-y-4 md:space-y-6">
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-3 md:pb-4">Resumen Financiero</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-slate-400 uppercase"><span>Subtotal Neto</span> <span className="text-white font-mono">$ {totals.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                    
                    {aiuEnabled ? (
                      <>
                        <div className="space-y-1.5 md:space-y-2 pt-2 border-t border-white/5">
                          <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Análisis A.I.U (Incluido en items)</p>
                          <div className="flex justify-between items-center text-[7px] md:text-[8px] font-bold text-slate-500 uppercase italic"><span>Admin/Impr/Util. ({totals.aiuPct}%)</span> <span className="font-mono">$ {Number(totals.aiuValue).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                          <div className="flex justify-between items-center text-[7px] md:text-[8px] font-black text-blue-400 uppercase pt-1 border-t border-white/5"><span>Base Gravable IVA</span> <span className="font-mono">$ {(totals.aiuValue).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                        </div>
                        <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-slate-400 uppercase pt-2"><span>I.V.A (sobre AIU)</span> <span className="text-emerald-400 font-mono">+ $ {totals.tax.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-slate-400 uppercase"><span>Impuestos IVA</span> <span className="text-white font-mono">$ {totals.tax.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span></div>
                    )}

                    <div className="pt-4 md:pt-6 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <p className="text-[7px] md:text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Orden</p>
                        <p className="text-xl md:text-3xl font-black font-mono text-white tracking-tighter">$ {totals.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Botón de Visualización Universal */}
                    <button
                      onClick={() => setStep('preview')}
                      className="w-full py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      Visualizar PDF <Eye className="w-4 h-4" />
                    </button>

                    {/* Botones de Acción según Rol y Estado */}
                    {canApprove && currentOrder?.status === 'Pending' ? (
                      <div className="space-y-3 mt-4">
                        <button
                          onClick={handleApprove}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          Aprobar Orden <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleReject}
                          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          Devolver / Corrección <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleSaveOrder(false)} title="Finalizar y Enviar para Aprobación" className="w-full py-4 md:py-5 bg-blue-600 rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-4 group">Validar y Enviar <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Seguridad y Firmas</h4>
                  </div>

                  <div className="space-y-4">
                    {currentOrder?.approvals && currentOrder.approvals.length > 0 ? (
                      currentOrder.approvals.map((app, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${app.approved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                              {app.approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{app.role || 'Aprobador'}</p>
                              <p className="text-[10px] font-bold text-slate-700">{app.userName}</p>
                            </div>
                          </div>
                          {app.approved && <span className="text-[7px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-0.5 rounded-lg">FIRMADO</span>}
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentOrder?.budgetApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                              {currentOrder?.budgetApproved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Firma Presupuesto</p>
                              <p className="text-[10px] font-bold text-slate-700">{currentOrder?.budgetApproved ? currentOrder.approvedByBudget : 'Pendiente'}</p>
                            </div>
                          </div>
                          {currentOrder?.budgetApproved && <span className="text-[7px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-0.5 rounded-lg">FIRMADO</span>}
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentOrder?.purchasingApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                              {currentOrder?.purchasingApproved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Firma Gerencia Compras</p>
                              <p className="text-[10px] font-bold text-slate-700">{currentOrder?.purchasingApproved ? currentOrder.approvedByPurchasing : 'Pendiente'}</p>
                            </div>
                          </div>
                          {currentOrder?.purchasingApproved && <span className="text-[7px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-0.5 rounded-lg">FIRMADO</span>}
                        </div>
                      </>
                    )}

                    {currentOrder?.status === 'Approved' && (
                      <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">ORDEN TOTALMENTE <br />APROBADA Y LIBERADA</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4"><Layers className="w-5 h-5 text-blue-500" /><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Gestión de Orden</h4></div>
                  
                  {/* AIU Section */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${aiuEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                          <Hash className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Aplicar A.I.U</p>
                          <p className="text-[7px] font-bold text-slate-400 uppercase">Activar para servicios o construcción</p>
                        </div>
                      </div>
                        <button
                          title="Alternar AIU"
                          onClick={() => setAiuEnabled(!aiuEnabled)}
                          className={`w-12 h-6 rounded-full transition-all relative ${aiuEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${aiuEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {aiuEnabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-3 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin %</label>
                          <input type="number" title="Porcentaje Administración" placeholder="0" value={aiuAdmin} onChange={e => setAiuAdmin(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-center font-black text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Imprev %</label>
                          <input type="number" title="Porcentaje Imprevistos" placeholder="0" value={aiuImprevistos} onChange={e => setAiuImprevistos(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-center font-black text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Utilidad %</label>
                          <input type="number" title="Porcentaje Utilidad" placeholder="0" value={aiuUtilidad} onChange={e => setAiuUtilidad(Number(e.target.value))} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-center font-black text-[10px]" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Estado Logístico (OCC)</label>
                        <select
                          title="Estado OCC"
                          value={occStatus}
                          onChange={e => handleUpdateLogistics(e.target.value)}
                          className={`w-full px-5 py-3.5 rounded-xl font-black text-[10px] uppercase outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500/20 transition-all ${occStatus === 'Entregado' ? 'bg-emerald-50 text-emerald-600' :
                            occStatus === 'EnProceso' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                            }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="EnProceso">En Proceso/Parcial</option>
                          <option value="Entregado">Entregado Total</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Forma de Pago</label>
                        <select
                          title="Forma de Pago"
                          value={paymentType}
                          onChange={e => setPaymentType(e.target.value as any)}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                          <option value="Credit">Crédito</option>
                          <option value="Advance">Anticipado</option>
                        </select>
                      </div>
                    </div>

                    {paymentType === 'Advance' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <label className="text-[7.5px] font-black text-blue-500 uppercase tracking-widest ml-1 block">Porcentaje Anticipo (%)</label>
                          <div className="relative">
                            <input
                              type="number" step="any"
                              min="0"
                              max="100"
                              value={Math.round(advancePct * 100)}
                              onChange={(e) => setAdvancePct(parseFloat(String(e.target.value).replace(/,/g, '.')) / 100)}
                              className="w-full px-5 py-3.5 bg-blue-50 border border-blue-100 rounded-xl font-black text-[10px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm pr-12"
                              placeholder="50"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400">%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[7.5px] font-black text-emerald-500 uppercase tracking-widest ml-1 block">Valor a Pagar</label>
                          <div className="w-full px-5 py-3.5 bg-emerald-50 border border-emerald-100 rounded-xl font-black text-[10px] text-emerald-700 flex items-center justify-between shadow-sm">
                            <span className="opacity-50">$</span>
                            <span>{Number(totals.total * advancePct).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Nº Cotización Referencia</label>
                      <input type="text" title="Quote" value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none text-[10px] font-black uppercase shadow-inner" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Observaciones Generales</label>
                        {currentOrderId && (
                          <button
                            onClick={async () => {
                              await updateOrder(currentOrderId, { comments });
                              toast.success("Observaciones actualizadas");
                            }}
                            className="text-[7px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-all"
                          >
                            Guardar Nota
                          </button>
                        )}
                      </div>
                      <textarea title="Comments" value={comments} onChange={e => setComments(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none text-[10px] font-semibold leading-relaxed min-h-[100px] shadow-inner" placeholder="Escriba condiciones especiales o notas aquí..." />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Bitácora / Comentarios</h4>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {currentOrder?.commentsHistory?.map((c, idx) => (
                      <div key={idx} className={`flex flex-col ${c.userId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-[10px] ${c.userId === currentUser?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                          <p className="font-bold mb-1">{c.userName}</p>
                          <p className="leading-relaxed">{c.text}</p>
                          <p className={`text-[7px] mt-2 opacity-60 font-medium ${c.userId === currentUser?.id ? 'text-white' : 'text-slate-400'}`}>
                            {new Date(c.timestamp).toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!currentOrder?.commentsHistory || currentOrder.commentsHistory.length === 0) && (
                      <div className="py-10 text-center opacity-30 italic text-[10px]">Sin comentarios registrados</div>
                    )}
                  </div>

                  <div className="relative pt-4 border-t border-slate-50">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Escribir un comentario interno..."
                      className="w-full p-4 bg-slate-50 rounded-2xl text-[10px] border border-slate-100 focus:border-blue-500 outline-none min-h-[80px] pr-12"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      title="Enviar comentario"
                      className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-30 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Final Summary / Success UI */}
          {wizardStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center py-12 md:py-24 text-center px-4"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-500 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center text-white mb-8 md:mb-12 shadow-[0_20px_50px_rgba(16,185,129,0.3)] ring-4 ring-emerald-50">
                <FileCheck className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter uppercase leading-none">Orden <br className="md:hidden" /><span className="text-emerald-500">Procesada</span></h1>
              <p className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-[0.3em] mb-12 md:mb-20 max-w-md mx-auto">Consolidado generado satisfactoriamente para el registro MIP-{String(previewSequence).padStart(4, '0')}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-3xl mb-12 md:mb-20">
                <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign className="w-20 h-20" /></div>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valor Total de Operación</p>
                  <p className="text-3xl md:text-5xl font-black font-mono text-slate-900 tracking-tighter">${totals.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group text-left">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Truck className="w-20 h-20" /></div>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Socio Comercial Aliado</p>
                  <p className="text-lg md:text-2xl font-black text-blue-600 uppercase truncate leading-tight">{currentSupplier?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Identificados con Nit {currentSupplier?.taxId}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-2xl">
                <button
                  onClick={() => setStep('preview')}
                  className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Visualizar Documento <Eye className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  {isGeneratingPDF ? <RefreshCw className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5 md:w-6 md:h-6" />} Descargar PDF
                </button>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="mt-16 md:mt-24 text-[10px] md:text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.4em] transition-all flex items-center gap-3 hover:gap-5"
              >
                FINALIZAR Y VOLVER AL CONTROL <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistence Navigation Bar - Premium Style */}
      {wizardStep < 4 && (
        <div className="fixed bottom-0 md:bottom-6 left-0 md:left-[280px] right-0 z-[60] px-0 md:px-6 pointer-events-none transition-all duration-500">
          <div className="max-w-7xl mx-auto w-full pointer-events-auto bg-slate-900/95 md:bg-white/95 backdrop-blur-2xl border-t md:border border-white/10 md:border-white/50 shadow-2xl rounded-t-3xl md:rounded-[2.5rem] p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 ring-1 ring-black/5">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                {wizardStep > 1 && (
                  <button onClick={goToPrevStep} className="px-4 md:px-6 py-3 md:py-4 text-white md:text-slate-400 hover:text-white md:hover:text-slate-900 font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
                    Atrás
                  </button>
                )}
                <button onClick={handleClearOrder} className="p-3 md:p-4 text-rose-400 hover:bg-rose-500/10 rounded-xl md:rounded-2xl transition-all" title="Limpiar">
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="sm:hidden text-right">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Operación</p>
                <p className="text-lg font-black font-mono text-white">$ {totals.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-8">
              <div className="hidden sm:block text-right border-r border-white/10 md:border-slate-100 pr-4 md:pr-8">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 md:text-slate-400 uppercase tracking-widest mb-0.5">Total Operación</p>
                <p className="text-sm md:text-2xl font-black font-mono text-white md:text-slate-900 leading-none">$ {totals.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
              </div>

              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                {wizardStep < 3 ? (
                  <button
                    onClick={goToNextStep}
                    disabled={wizardStep === 1 ? !selectedSupplierId : items.length === 0}
                    className="flex-1 sm:flex-none px-6 md:px-12 py-3.5 md:py-4 bg-blue-600 md:bg-slate-950 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
                  >
                    {wizardStep === 1 ? 'Siguiente' : 'Validar Items'} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      title="Pausar y guardar"
                      onClick={() => { handleSaveOrder(true); navigate('/dashboard'); }}
                      className="hidden md:flex px-6 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all items-center gap-2 outline-none"
                    >
                      <Clock className="w-4 h-4" /> Pausar
                    </button>

                    {(() => {
                      if (!canApprove || currentOrder?.status !== 'Pending') return (
                        <button
                          onClick={() => {
                            if (items.length === 0) return toast.error("Agregue al menos un item");
                            setIsApproverModalOpen(true);
                          }}
                          disabled={items.length === 0}
                          className="flex-1 sm:flex-none px-8 md:px-12 py-3.5 md:py-4 bg-blue-600 md:bg-slate-950 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 md:hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95 shadow-blue-500/20"
                        >
                          Confirmar <ArrowRight className="w-4 h-4" />
                        </button>
                      );

                      const name = currentUser?.name.toLowerCase() || '';
                      const isBudget = name.includes('magdaly');
                      const isPurchasing = name.includes('maria alejandra');
                      const hasUserSigned = currentOrder?.approvals?.some(a => a.userId === currentUser?.id && a.approved);
                      const isLegacySigned = (isBudget && currentOrder?.budgetApproved) || (isPurchasing && currentOrder?.purchasingApproved);

                      if (hasUserSigned || isLegacySigned) {
                        return (
                          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Firmada</span>
                          </div>
                        );
                      }

                      return (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={handleReject}
                            className="p-3.5 md:px-8 md:py-4 bg-rose-500 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4" /> <span className="hidden md:inline">Devolver</span>
                          </button>
                          <button
                            onClick={handleApprove}
                            className="flex-1 px-8 md:px-10 py-3.5 md:py-4 bg-emerald-500 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Aprobar
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isProductModalOpen && <ProductModal onClose={() => setIsProductModalOpen(false)} onSave={addProduct} selectedSupplierId={selectedSupplierId} suppliers={suppliers} />}
        {isSupplierModalOpen && <SupplierModal onClose={() => setIsSupplierModalOpen(false)} onSave={addSupplier} />}
        {isApproverModalOpen && (
          <ApproverSelectionModal
            onClose={() => setIsApproverModalOpen(false)}
            onConfirm={() => {
              setIsApproverModalOpen(false);
              handleSaveOrder(false);
            }}
            users={users}
            selectedApproverIds={selectedApproverIds}
            onToggleApprover={toggleApprover}
          />
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body.printing-mode .no-print { display: none !important; }
        body.printing-mode .printable-order { margin: 0 !important; border: 0 !important; width: 100% !important; }
      `}</style>
    </div>
  );
};

// COMPONENTES MODULARES (MODALES)
const MODAL_CATEGORIES = ['SUMINISTRO', 'REPUESTOS', 'SERVICIOS', 'LUBRICANTES', 'FERRETERIA', 'DOTACION', 'EPP', 'ALIMENTACION', 'ALQUILER', 'HERRAMIENTAS', 'PAPELERIA', 'ASEO', 'MANTENIMIENTO'];
const MODAL_UNITS = ['UNIDAD - UND', 'CAJA - CAJA', 'GALÓN - GAL', 'GRAMO (G)', 'KILOGRAMO (KG)', 'LIBRA - LB', 'LITRO - L', 'METRO - M', 'METRO CUADRADO (M²)', 'METRO CÚBICO (M³)', 'MILÍMETRO (MM)', 'ONZA - OZ', 'PAQUETE', 'PULGADA (IN)', 'TONELADA - TON', 'DIAS - DIA', 'MINUTOS - MIN'];

export const ProductModal = ({ onClose, onSave, selectedSupplierId, suppliers }: any) => {
  const [data, setData] = useState({
    name: '',
    code: `SKU-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    unitPrice: '',
    unit: 'UNIDAD - UND',
    category: 'SUMINISTRO',
    type: 'Producto',
    supplierId: selectedSupplierId || ''
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    const cats = new Set([...MODAL_CATEGORIES, ...customCategories]);
    return Array.from(cats).sort();
  }, [customCategories]);

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim().toUpperCase();
    if (!trimmed) return;
    if (!allCategories.includes(trimmed)) {
      setCustomCategories(prev => [...prev, trimmed]);
    }
    setData({ ...data, category: trimmed });
    setNewCategoryName('');
    setIsAddingCategory(false);
    toast.success(`Categoría "${trimmed}" lista`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[3rem] overflow-visible shadow-2xl max-h-[92vh] flex flex-col"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="p-6 md:p-10 pb-0 md:pb-0 shrink-0">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1 font-outfit uppercase">Nuevo <span className="text-blue-600">Suministro</span></h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-8 font-outfit">Maestro de Recursos MIP</p>
        </div>
        <div className="px-6 md:px-10 pb-6 md:pb-10 overflow-y-auto overflow-x-visible scrollbar-hide space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Nombre Comercial del Recurso</label>
            <input type="text" placeholder="EJ: LLANTA PARA CARROTANQUE" value={data.name} onChange={e => setData({ ...data, name: e.target.value.toUpperCase() })} className="w-full p-4 md:p-5 bg-slate-50 rounded-2xl font-black text-xs md:text-sm uppercase ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all font-outfit" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Referencia / SKU</label>
              <input type="text" placeholder="REF-001" value={data.code} onChange={e => setData({ ...data, code: e.target.value.toUpperCase() })} className="w-full p-4 bg-slate-50 rounded-2xl font-black uppercase text-xs outline-none ring-1 ring-slate-100 focus:ring-blue-500/30 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Precio Base Sugerido</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="any" title="Precio Unitario" placeholder="0" value={data.unitPrice} onChange={e => setData({ ...data, unitPrice: e.target.value })} className="w-full p-4 pl-8 bg-slate-50 rounded-2xl font-black font-mono text-xs outline-none ring-1 ring-slate-100 focus:ring-blue-500/30" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Clasificación / Categoría</label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value.toUpperCase())}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setIsAddingCategory(false); }}
                    className="flex-1 px-4 py-4 bg-blue-50 rounded-2xl font-black text-[10px] md:text-xs uppercase ring-2 ring-blue-400/50 outline-none font-outfit"
                    placeholder="Escribir..."
                  />
                  <button type="button" onClick={handleAddCategory} className="px-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"><Plus className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="px-4 bg-slate-200 text-slate-500 rounded-2xl hover:bg-slate-300 transition-all"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={data.category}
                    onChange={e => {
                      if (e.target.value === '__ADD__') setIsAddingCategory(true);
                      else setData({ ...data, category: e.target.value });
                    }}
                    className="w-full p-4 bg-slate-50 rounded-2xl font-black uppercase text-xs outline-none ring-1 ring-slate-100 focus:ring-blue-500/30 appearance-none cursor-pointer font-outfit"
                  >
                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="__ADD__" className="text-blue-600 font-bold">＋ AGREGAR NUEVA CATEGORÍA</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Unidad de Gestión</label>
              <div className="relative">
                <select value={data.unit} onChange={e => setData({ ...data, unit: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-black uppercase text-xs outline-none ring-1 ring-slate-100 focus:ring-blue-500/30 appearance-none cursor-pointer font-outfit">
                  {MODAL_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-[210]">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 font-outfit">Proveedor / Aliado Preferente</label>
            <SearchableSelect options={suppliers.map((s: any) => ({ value: s.id, label: s.name }))} value={data.supplierId} onChange={(v: any) => setData({ ...data, supplierId: v })} placeholder="Seleccionar de la lista..." />
          </div>

          <button onClick={() => { 
            const price = typeof data.unitPrice === 'string' ? parseFloat(data.unitPrice.replace(/,/g, '.')) || 0 : data.unitPrice;
            onSave({ ...data, unitPrice: price, id: Date.now().toString() }); 
            onClose(); 
          }} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/40 hover:bg-black hover:scale-[1.02] transition-all mt-4 font-outfit active:scale-95">Inscribir en Maestro</button>
        </div>
      </motion.div>
    </div>
  );
};

export const SupplierModal = ({ onClose, onSave }: any) => {
  const [data, setData] = useState({ name: '', taxId: '', email: '', phone: '' });
  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 md:mb-8">Nuevo <span className="text-emerald-600">Aliado</span></h2>
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Razón Social</label>
            <input type="text" placeholder="NOMBRE DE LA EMPRESA" value={data.name} onChange={e => setData({ ...data, name: e.target.value.toUpperCase() })} className="w-full p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase outline-none focus:ring-1 focus:ring-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Identificación (NIT)</label>
            <input type="text" placeholder="900.000.000-1" value={data.taxId} onChange={e => setData({ ...data, taxId: e.target.value })} className="w-full p-3 md:p-4 bg-slate-50 rounded-xl font-bold text-[10px] md:text-xs outline-none focus:ring-1 focus:ring-slate-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
              <input type="email" placeholder="ventas@aliado.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="p-3 md:p-4 bg-slate-50 rounded-xl font-bold text-[10px] md:text-xs w-full outline-none focus:ring-1 focus:ring-slate-200" />
            </div>
            <div className="space-y-2">
              <label className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono</label>
              <input type="text" placeholder="300 000 0000" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} className="p-3 md:p-4 bg-slate-50 rounded-xl font-bold text-[10px] md:text-xs w-full outline-none focus:ring-1 focus:ring-slate-200" />
            </div>
          </div>
          <button onClick={() => { onSave({ ...data, id: Date.now().toString() }); onClose(); }} className="w-full py-4 md:py-5 bg-emerald-600 text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl hover:bg-emerald-700 transition-all mt-2 md:mt-4">Incorporar Socio</button>
        </div>
      </motion.div>
    </div>
  );
};

export const ApproverSelectionModal = ({ onClose, onConfirm, users, selectedApproverIds, onToggleApprover }: any) => {
  const approvers = users.filter((u: any) => u.isActive && (u.role === 'Approver' || u.role === 'Admin'));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">Seleccionar <span className="text-blue-600">Firmas</span></h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">¿Quiénes deben aprobar esta orden?</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {approvers.map((u: any) => (
            <button
              key={u.id}
              onClick={() => onToggleApprover(u.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedApproverIds.includes(u.id)
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/10'
                : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedApproverIds.includes(u.id) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase">{u.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">{u.role}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedApproverIds.includes(u.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
                }`}>
                {selectedApproverIds.includes(u.id) && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={selectedApproverIds.length === 0}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            Confirmar y Enviar <Send className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Cancelar</button>
        </div>
      </motion.div>
    </div>
  );
};