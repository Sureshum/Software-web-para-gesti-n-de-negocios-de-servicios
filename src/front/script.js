const API_URL = 'https://software-web-para-gesti-n-de-negocios-de.onrender.com';

const titlesMap = {
    'tenants': '1. Registrar Negocio',
    'users': '2. Registrar Usuario',
    'clients': '3. Registrar Cliente',
    'inventory': '4. Registrar Inventario',
    'service-orders': '5. Órdenes de Servicio'
};

function switchSection(sectionKey) {
    document.querySelectorAll('.form-section').forEach(sec => {
        sec.classList.add('hidden');
    });

    const activeSection = document.getElementById(`section-${sectionKey}`);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }

    document.getElementById('headerTitle').textContent = titlesMap[sectionKey] || 'Panel';

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition hover:bg-slate-800 hover:text-white text-slate-300';
    });

    const activeBtn = document.getElementById(`nav-${sectionKey}`);
    if (activeBtn) {
        activeBtn.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition bg-indigo-600 text-white';
    }
}

function showToast(message = '¡Creado exitosamente!') {
    const toast = document.getElementById('toastNotification');
    const msgSpan = document.getElementById('toastMessage');
    
    msgSpan.textContent = message;
    
    // Mostrar el toast (deslizar hacia arriba y volver opaco)
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
}

async function createEntity(event, endpoint, formId) {
    event.preventDefault();
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error en el servidor al guardar el registro');

        showToast('¡Creado exitosamente!');
        form.reset();
        
        // Si creamos un negocio, recargamos los selects de los demás formularios
        if (endpoint === 'tenants') {
            loadTenantsDropdown();
        }
    } catch (error) {
        console.error(error);
        alert('Hubo un error al guardar el registro.');
    }
}

async function createTenantCustom(event) {
    await createEntity(event, 'tenants', 'tenantForm');
}

async function loadClientsDropdown() {
    try {
        const response = await fetch(`${API_URL}/clients`);
        if (!response.ok) throw new Error('No se pudieron cargar los clientes');
        
        const clients = await response.json();
        const selectElement = document.getElementById('orderClientId');
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Seleccione un cliente...</option>';
        
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `ID: ${client.id} - ${client.name}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando clientes:', error);
        const el = document.getElementById('orderClientId');
        if (el) el.innerHTML = '<option value="">Error al cargar clientes</option>';
    }
}

async function loadUsersDropdown() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('No se pudieron cargar los usuarios');
        
        const users = await response.json();
        const selectElement = document.getElementById('orderUserId');
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Seleccione un usuario...</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `ID: ${user.id} - ${user.name} (${user.role})`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        const el = document.getElementById('orderUserId');
        if (el) el.innerHTML = '<option value="">Error al cargar usuarios</option>';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadTenantsDropdown();
    loadClientsDropdown();
    loadUsersDropdown();
});

async function loadTenantsDropdown() {
    try {
        const response = await fetch(`${API_URL}/tenants`);
        if (!response.ok) throw new Error('No se pudieron cargar los negocios');
        
        const tenants = await response.json();
        const selectIds = ['userTenantId', 'clientTenantId', 'inventoryTenantId', 'orderTenantId'];
        
        selectIds.forEach(selectId => {
            const selectElement = document.getElementById(selectId);
            if (!selectElement) return;
            
            selectElement.innerHTML = '<option value="">Seleccione un negocio...</option>';
            
            tenants.forEach(tenant => {
                const option = document.createElement('option');
                option.value = tenant.id;
                option.textContent = `ID: ${tenant.id} - ${tenant.name} (${tenant.subdomain})`;
                selectElement.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error cargando los selectores de negocios:', error);
        const selectIds = ['userTenantId', 'clientTenantId', 'inventoryTenantId', 'orderTenantId'];
        selectIds.forEach(selectId => {
            const el = document.getElementById(selectId);
            if (el) el.innerHTML = '<option value="">Error al conectar con el servidor</option>';
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadTenantsDropdown();
});
