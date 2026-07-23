const API_URL = 'https://software-web-para-gesti-n-de-negocios-de.onrender.com';
const ADMIN_PASSWORD = 'admin'; 
let currentEntity = 'tenants';
let editingId = null;

function handleLogin(event) {
    event.preventDefault();
    const pass = document.getElementById('adminPassword').value;

    if (pass === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadData();
    } else {
        alert('Contraseña incorrecta');
    }
}

function logout() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPassword').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });

        sidebar.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });
    }
});

function switchTab(entity) {
    currentEntity = entity;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.target === entity) {
            btn.className = 'tab-btn bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition';
        } else {
            btn.className = 'tab-btn bg-white text-slate-700 border px-4 py-2 rounded-lg font-medium transition';
        }
    });

    const titles = {
        'tenants': 'Negocios',
        'users': 'Usuarios',
        'clients': 'Clientes',
        'inventory': 'Inventario',
        'service-orders': 'Órdenes'
    };
    document.getElementById('tableTitle').textContent = titles[entity] || entity;
    loadData();
}

function formatCellValue(key, value) {
    if (value === undefined || value === null) return '';

    if ((key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) && typeof value === 'string' && value.includes('T')) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return value;
}

async function updateOrderStatus(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/service-orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('No se pudo actualizar el estado');
    } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado en el servidor.'); 
        loadData();
    }
}

async function deleteRecord(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

    try {
        const response = await fetch(`${API_URL}/${currentEntity}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('No se pudo eliminar el registro');
        loadData();
    } catch (error) {
        console.error(error);
        alert('Error al eliminar el registro del servidor.');
    }
}

async function openEditModal(id) {
    editingId = id;
    try {
        const response = await fetch(`${API_URL}/${currentEntity}/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener el registro');
        const item = await response.json();

        const container = document.getElementById('editFormFields');
        container.innerHTML = '';

        for (const [key, value] of Object.entries(item)) {
            if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || typeof value === 'object') continue;

            const div = document.createElement('div');
            div.className = 'flex flex-col';
            div.innerHTML = `
                <label class="text-xs font-semibold text-slate-600 uppercase mb-1">${key}</label>
                <input type="text" name="${key}" value="${value !== null ? value : ''}" class="p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none">
            `;
            container.appendChild(div);
        }

        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos para editar.');
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingId = null;
}

async function saveEdit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = {};
    
    formData.forEach((value, key) => {
        if (!isNaN(value) && value.trim() !== '') {
            updatedData[key] = Number(value);
        } else {
            updatedData[key] = value;
        }
    });

    try {
        const response = await fetch(`${API_URL}/${currentEntity}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('No se pudo actualizar');

        closeEditModal();
        loadData();
        alert('Registro actualizado con éxito');
    } catch (error) {
        console.error(error);
        alert('Error al actualizar el registro en el servidor.');
    }
}

async function loadData() {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-slate-500">Cargando datos...</td></tr>`;

    try {
        const response = await fetch(`${API_URL}/${currentEntity}`);
        if (!response.ok) throw new Error('No se pudo obtener la información');
        
        let data = await response.json();

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-slate-500">No hay registros en esta tabla.</td></tr>`;
            return;
        }

        // Definir columnas para cada entidad
        const entityColumns = {
            'tenants': ['id', 'name', 'subdomain', 'email', 'phone', 'createdAt', 'updatedAt'],
            'users': ['id', 'tenantId', 'name', 'email', 'role', 'phone', 'createdAt', 'updatedAt'],
            'clients': ['id', 'tenantId', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
            'inventory': ['id', 'tenantId', 'name', 'stock', 'minStockAlert', 'unitPrice', 'createdAt', 'updatedAt'],
            'service-orders': ['id', 'tenantId', 'clientId', 'assignedTo', 'status', 'description', 'totalCost', 'createdAt']
        };

        const columnNamesMap = {
            id: 'ID',
            tenantId: 'Negocio ID',
            clientId: 'Cliente',
            assignedTo: 'Asignado a',
            name: 'Nombre',
            subdomain: 'Subdominio',
            email: 'Correo',
            passwordHash: 'Contraseña',
            role: 'Rol',
            phone: 'Teléfono',
            stock: 'Stock',
            minStockAlert: 'Alerta Mínima',
            unitPrice: 'Precio Unitario',
            totalCost: 'Costo Total',
            status: 'Estado',
            description: 'Descripción',
            createdAt: 'Fecha de Creación',
            updatedAt: 'Fecha de Actualización'
        };

        // Obtener las columnas permitidas
        const allowedKeys = entityColumns[currentEntity] || Object.keys(data[0]);
        const keys = allowedKeys.filter(key => key in data[0]);
        
        let headHtml = '<tr>';
        keys.forEach(key => {
            const displayName = columnNamesMap[key] || key.toUpperCase();
            headHtml += `<th class="p-3 font-semibold uppercase text-xs">${displayName}</th>`;
        });
        headHtml += `<th class="p-3 font-semibold uppercase text-xs text-center">Acciones</th>`;
        headHtml += '</tr>';
        tableHead.innerHTML = headHtml;

        let bodyHtml = '';
        data.forEach(item => {
            bodyHtml += '<tr class="hover:bg-slate-50 transition border-b border-slate-100">';
            
            keys.forEach(key => {
                const rawValue = item[key];
                
                if (currentEntity === 'service-orders' && key.toLowerCase() === 'status') {
                    const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
                    let selectHtml = `<select onchange="updateOrderStatus(${item.id}, this.value)" class="p-1 border rounded text-xs bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-400 outline-none">`;
                    
                    statuses.forEach(st => {
                        const selected = rawValue === st ? 'selected' : '';
                        selectHtml += `<option value="${st}" ${selected}>${st}</option>`;
                    });
                    selectHtml += `</select>`;
                    
                    bodyHtml += `<td class="p-3">${selectHtml}</td>`;
                } 
                else if (currentEntity === 'inventory' && key.toLowerCase() === 'stock') {
                    bodyHtml += `
                        <td class="p-3">
                            <div class="flex items-center gap-3">
                                <span class="font-bold text-slate-900 text-base" id="stock-val-${item.id}">${rawValue}</span>
                                <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                                    <input type="number" id="qty-${item.id}" value="1" min="1" class="w-10 text-center py-0.5 text-xs font-semibold bg-transparent outline-none border-r border-slate-200">
                                    <button onclick="adjustStock(${item.id}, -1)" class="bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 text-xs font-bold transition" title="Restar stock">-</button>
                                    <button onclick="adjustStock(${item.id}, 1)" class="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 text-xs font-bold transition" title="Sumar stock">+</button>
                                </div>
                            </div>
                        </td>
                    `;
                } else {
                    const formattedValue = formatCellValue(key, rawValue);
                    bodyHtml += `<td class="p-3 text-slate-600 truncate max-w-xs">${formattedValue}</td>`;
                }
            });

            bodyHtml += `
                <td class="p-3 text-center whitespace-nowrap">
                    <button onclick="openEditModal(${item.id})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-amber-600 transition mr-1">✏️ Editar</button>
                    <button onclick="deleteRecord(${item.id})" class="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition">🗑️ Borrar</button>
                </td>
            `;

            bodyHtml += '</tr>';
        });
        tableBody.innerHTML = bodyHtml;

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-red-500">Error al conectar con el servidor o el endpoint GET no está creado.</td></tr>`;
    }
}
