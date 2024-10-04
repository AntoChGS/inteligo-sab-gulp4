// Imports
//=require jquery/dist/jquery.min.js

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.itg-toggle-btn-sidebar').forEach(button => {
        button.addEventListener('click', () => {
            // Encuentra el primer elemento con la clase 'sidebar'
            const burgerBtn = document.querySelector('.itg-burger-btn');
            const sidebar = document.querySelector('.itg-layout-sticky-container .layout-sidebar');
            burgerBtn.classList.toggle('active');
            sidebar.classList.toggle('open');
        });
    });
    
    // SIDEBAR MOBILE
    const toggleButton = document.getElementById('toggle-button-mobile');
    const closeButton = document.getElementById('close-button-mobile');
    const sidebar = document.getElementById('sidebar-mobile');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.body.style.overflow = 'hidden'; // Oculta el overflow del body
    });

    closeButton.addEventListener('click', () => {
        sidebar.classList.remove('open');
        document.body.style.overflow = 'auto'; // Restablece el overflow del body
    });

    // SELECT DROPDOWN
    const dropdowns = document.querySelectorAll('.itg-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.itg-dropdown-toggle');
        const menu = dropdown.querySelector('.itg-dropdown-menu');

        toggle.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del clic
            const isOpen = menu.classList.contains('show');

            // Cerrar todos los dropdowns abiertos
            document.querySelectorAll('.itg-dropdown-menu').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.itg-dropdown-toggle').forEach(t => t.classList.remove('show'));

            if (!isOpen) {
                menu.classList.add('show');
                toggle.classList.add('show');
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.itg-dropdown')) {
            document.querySelectorAll('.itg-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            document.querySelectorAll('.itg-dropdown-toggle').forEach(toggle => toggle.classList.remove('show'));
        }
    });

    // ACCORDION
    const buttons = document.querySelectorAll('.itg-accordion .accordion-toggle');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);
            const headerElement = this.closest('.accordion-header'); // Encuentra el encabezado más cercano

            if (targetElement.classList.contains('show')) {
                // Close the target element
                targetElement.classList.remove('show');
                targetElement.style.height = '0'; // Collapse height to 0
                setTimeout(() => {
                    targetElement.classList.remove('collapse');
                    targetElement.style.display = 'none'; // Hide after transition
                }, 300); // Match this with the transition duration

                // Update button state
                this.classList.add('collapsed');

                // Add 'close' class to the accordion header
                if (headerElement) {
                    headerElement.classList.add('close');
                }
            } else {
                // Open the target element
                targetElement.classList.add('collapse');
                targetElement.style.display = 'block';
                // Trigger reflow to apply transition
                targetElement.offsetHeight; // Trigger reflow
                targetElement.classList.add('show');
                targetElement.style.height = targetElement.scrollHeight + 'px'; // Set height to the content height

                // Update button state
                this.classList.remove('collapsed');

                // Remove 'close' class from the accordion header
                if (headerElement) {
                    headerElement.classList.remove('close');
                }
            }
        });
    });

    // TOOLTIP
    const tooltipTriggers = document.querySelectorAll('.itg-tooltips .tooltip-trigger');

    tooltipTriggers.forEach(trigger => {
        const tooltipContainer = trigger.parentElement;
        const tooltipContent = tooltipContainer.querySelector('.tooltip-content');

        // Mostrar el tooltip al pasar el mouse
        trigger.addEventListener('mouseover', () => {
            tooltipContent.style.visibility = 'visible';
            tooltipContent.style.opacity = '1';
        });

        // Ocultar el tooltip al quitar el mouse, si el mouse no está sobre el tooltip
        trigger.addEventListener('mouseout', () => {
            if (!tooltipContent.matches(':hover')) {
                tooltipContent.style.visibility = 'hidden';
                tooltipContent.style.opacity = '0';
            }
        });

        // Mostrar el tooltip cuando se hace clic en el trigger
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene que el clic cierre el tooltip inmediatamente
            tooltipContent.style.visibility = 'visible';
            tooltipContent.style.opacity = '1';
        });

        // Ocultar el tooltip cuando se hace clic fuera
        const closeTooltip = (e) => {
            if (!tooltipContainer.contains(e.target)) {
                tooltipContent.style.visibility = 'hidden';
                tooltipContent.style.opacity = '0';
            }
        };

        document.addEventListener('click', closeTooltip);
    });

    // MODAL
    // Function to open the modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Temporarily set display to block to ensure the modal is rendered
            modal.style.display = "block";
            // Ensure a new frame is rendered before adding the transition class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10); // Brief delay to trigger transition

            document.body.classList.add('modal-open');
        }
    }

    // Function to close the modal
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        // Delay hiding the modal to allow the transition to complete
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); // Match the transition duration in CSS
    }

    // Event listener for open modal buttons and links
    document.querySelectorAll('.itg-open-modal-btn').forEach(element => {
        element.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action for links
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Event listener for close buttons
    document.querySelectorAll('.itg-close-modal, .itg-close-modal-btn').forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.itg-modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('itg-modal')) {
            closeModal(event.target);
        }
    });

    // TABS
    // Función para activar una pestaña y sincronizar botones externos
    function activateTab(container, button) {
        const tabButtons = container.querySelectorAll('.itg-tabs .tab-button');
        const tabPanes = container.querySelectorAll('.itg-tabs .tab-pane');
        const targetTabId = button.getAttribute('data-tab');
        const targetPane = container.querySelector(`#${targetTabId}`);

        // Elimina la clase activa de todos los botones y panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Añade la clase activa al botón y al pane correspondiente
        button.classList.add('active');
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Actualiza la clase activa en los botones externos relacionados
        const containerId = container.getAttribute('id');
        document.querySelectorAll(`.itg-tab-btn-external[data-tabs-id="${containerId}"]`).forEach(externalButton => {
            externalButton.classList.remove('active');
            if (externalButton.getAttribute('data-target') === targetTabId) {
                externalButton.classList.add('active');
            }
        });
    }

    // Manejo de clics en botones de tabs internos
    document.querySelectorAll('.itg-tabs').forEach(container => {
        const tabButtons = container.querySelectorAll('.itg-tabs .tab-button');

        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Evita el comportamiento predeterminado
                activateTab(container, button);
            });
        });
    });

    // Manejo de clics en botones externos
    document.querySelectorAll('.itg-tab-btn-external').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado
            const targetTabId = button.getAttribute('data-target');
            const tabsId = button.getAttribute('data-tabs-id');
            const container = document.getElementById(tabsId);
            const targetTabButton = container ? container.querySelector(`[data-tab="${targetTabId}"]`) : null;

            if (targetTabButton) {
                activateTab(container, targetTabButton);
            }
        });
    });
});


// Datos de ejemplo
const barsData = [
    { id: 'bar1', percentageId: 'percentage1', amount: 13615.22 },
    { id: 'bar2', percentageId: 'percentage2', amount: 5879.32 },
    { id: 'bar3', percentageId: 'percentage3', amount: 5879.32 },
    { id: 'bar4', percentageId: 'percentage4', amount: 5879.32 },
    { id: 'bar5', percentageId: 'percentage5', amount: 11448.56 }
];

// Calcular el monto total
const totalAmount = barsData.reduce((total, item) => total + item.amount, 0);

// Calcular los porcentajes
const percentages = barsData.map(item => {
    const percentage = (item.amount / totalAmount) * 100;
    return {
        id: item.id,
        percentageId: item.percentageId,
        percentage: percentage
    };
});

// Redondear y ajustar porcentajes para que sumen exactamente 100%
let totalPercentage = percentages.reduce((total, item) => total + item.percentage, 0);
const adjustedPercentages = percentages.map(item => {
    const adjustedPercentage = Math.floor(item.percentage);
    return {
        id: item.id,
        percentageId: item.percentageId,
        percentage: adjustedPercentage
    };
});

// Recalcular el porcentaje total
totalPercentage = adjustedPercentages.reduce((total, item) => total + item.percentage, 0);

// Ajustar el primer elemento para que el total sea exactamente 100%
if (totalPercentage < 100) {
    adjustedPercentages[0].percentage += (100 - totalPercentage);
}

// Función para animar las barras de progreso
function animateBars(data) {
    data.forEach((dataItem, index) => {
        const barElement = document.getElementById(dataItem.id);
        const fillElement = barElement.querySelector('.itg-fill');
        const percentageElement = document.getElementById(dataItem.percentageId);

        if (fillElement && percentageElement) {
            // Actualizar el porcentaje y el contenido del span
            percentageElement.textContent = `${Math.round(dataItem.percentage)}%`;

            // Animar el ancho de la barra de llenado
            // Añadir un retraso para asegurar que la animación se aplique secuencialmente
            setTimeout(() => {
                fillElement.style.width = `${dataItem.percentage}%`;
            }, index * 500); // Retraso incremental basado en el índice
        }
    });
}

// Iniciar animación de barras después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    animateBars(adjustedPercentages);
});