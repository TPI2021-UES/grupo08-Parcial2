//Declaracion de elementos para la tabla
const idTbody = document.getElementById('idTbody');

//Declaracion de elementos para el modal de eliminar 
const idModalDelete = document.getElementById('idModalDelete');
const idCloseIconDelete = document.getElementById('idCloseIconDelete');
const idButtonDelete = document.getElementById('idButtonDelete');
const idOrderBy = document.getElementById('idOrderBy');

//Url api
const url = "http://localhost:3000/lenguajes";
const urlTypes = "http://localhost:3000/categories";

//Declaracion de elementos para el modal de Registro y edicion
const idSelectTipo = document.getElementById('idSelectTipo');
const idButtonRegistrar = document.getElementById('idButtonRegistrar');
const idModalRE = document.getElementById('idModalRE');
const idCloseIconEdit = document.getElementById('idCloseIconEdit');
const nameP = document.getElementById('idInputName');
const idInputDescription = document.getElementById('idInputDescription');
const urlImage = document.getElementById('idInputImg');
const tipoP = document.getElementById('idSelectTipo');
const idBtnRegistrar = document.getElementById('idBtnRegistrar');
const blockError = document.getElementsByClassName('modal__error');
const modalContainer = document.getElementsByClassName('modal__container');
let dataObjetcs;
let totalObjetcs;
//funcion para filtrar los elementos
function filterElements(catstr) {
	var code="null";
	switch(catstr) {
		case "Desarrollo Web":code="1";break;
	    case "Desarrollo de Videojuegos":code="2";break;
		case "Desarrollo Blockchain":code="3";break;
		case "Multiproposito":code="4";break;
	}
	return code;
}


//funcion para  listar los objetos
function listLenguajes(lenguajes) {
    let orden = idOrderBy.value;
    idTbody.innerHTML = '';
    console.log(orden)
    if(orden == 0) {
        lenguajes.forEach((da, index) => {
            addRow(da, index);
        })
    }
    else if(orden == 1) {
        lenguajes.sort((a, b) => {
            if(a.name < b.name) return -1
            else if(a.name > b.name) return 1
            return 0;
        }).forEach((da, index) => {
                addRow(da, index);
            });
    }
    else if(orden == 2) {
        lenguajes.sort((a, b) => {
            if(a.name < b.name) return 1
            else if(a.name > b.name) return -1
            return 0;
        }).forEach((da, index) => {
            addRow(da, index);
        });
    }

    idOrderBy.addEventListener('change', () => {
        listLenguajes(lenguajes);
    })
}


const cleanInputs = () => {
    nameP.value = "";
    idInputDescription.value = "";
    urlImage.value = "";
    idSelectTipo.value = '0';
}

//Metodos para abrir y cerrar los modals
idButtonRegistrar.addEventListener('click', () => {
    idModalRE.classList.add('open-modal-delete');
    idModalRE.classList.remove('close-modal-delete');
    
});
idCloseIconEdit.addEventListener('click', () => {
    idModalRE.classList.remove('open-modal-delete');
    idModalRE.classList.add('close-modal-delete');
    cleanInputs();
});

idCloseIconDelete.addEventListener('click', () => {
    idModalDelete.classList.add('close-modal-delete');
    idModalDelete.classList.remove('open-modal-delete');

});

const openDeleteRow = () => {
    table.addEventListener('click', (e) => {
        if(e.target.getAttribute('option') === 'delete') {
            const nameP = e.target.parentNode.parentNode.parentNode.children[1].innerText;
            const idP = e.target.parentNode.parentNode.parentNode.children[0].getAttribute('id-value');
            const numero = Number(e.target.parentNode.parentNode.parentNode.children[0].innerText);
            const height = table.offsetHeight/totalObjetcs;
            idModalDelete.classList.add('open-modal-delete');
            idModalDelete.classList.remove('close-modal-delete');
            idModalDelete.children[2].innerText = `Desea eliminar el lenguaje de programacion ${nameP}`;
            idModalDelete.children[3].setAttribute('id-value', idP);
            console.log(table.offsetHeight);
            idModalDelete.style.top =  `${height * numero}px`;
        }
    });
}

//Registrar un nuemo Lenguaje de programacion
idBtnRegistrar.addEventListener('click', () => {
    let boolRegister = false;
    if(nameP.value === '') {
        blockError[0].innerText = 'Error en el nombre';
        blockError[0].style.display = 'block';
        modalContainer[0].style.height = '85px';
        boolRegister = false;
    } else {
        blockError[0].style.display = 'none';
        modalContainer[0].style.height = '60px';
        boolRegister = true;
    }
    if(idInputDescription.value === '') {
        blockError[1].innerText = 'Error en la descripccion';
        blockError[1].style.display = 'block';
        modalContainer[1].style.height = '190px';
        boolRegister = false;

    } else {
        blockError[1].style.display = 'none';
        modalContainer[1].style.height = '160px';
        boolRegister = true;
    }
    if(urlImage.value === '') {
        blockError[2].innerText = 'Error en la url';
        blockError[2].style.display = 'block';
        modalContainer[2].style.height = '85px';
        boolRegister = false;
    } else {
        blockError[2].style.display = 'none';
        modalContainer[2].style.height = '60px';
        boolRegister = true;
    }
    if(idSelectTipo.value === '0') {
        blockError[3].innerText = 'Seleccione una categoria';
        blockError[3].style.display = 'block';
        modalContainer[3].style.height = '85px';
        boolRegister = false;
    } else {
        blockError[3].style.display = 'none';
        modalContainer[3].style.height = '60px';
        boolRegister = true;
    }
    if(boolRegister) {
        const data = {
            'name': nameP.value,
            'description': idInputDescription.value,
            'image': urlImage.value,
            'categoryId': Number(idSelectTipo.value)
        }
        console.log(data);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
            .then(data => {
                if(data.hasOwnProperty('name')){
                    cleanInputs;
                    idModalRE.classList.add('close-modal-delete');
                    idModalRE.classList.remove('open-modal-delete');
                    getAllObjetcs();
                }
            })
        .catch(error => console.log(error));
    }
    
});

//Recuperacion de todas las categorias
const getAllCategories = () => {
    fetch(`${urlTypes}`, {
        method: "GET"
    }) .then(response => response.json()) .then(data => {
            data.forEach(da => {
                idSelectTipo.innerHTML += `
                    <option value = "${da.id}">${da.name}</option>
                `
            })
        })
        .catch(error => console.log(error));
}

//Recuperacion de todos los lenguajes de programacion
const getAllObjetcs = () => {
    fetch(`${url}?_expand=category`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        idTbody.innerHTML = "";
        dataObjetcs = data;
        totalObjetcs = data.length;
        listLenguajes(data);
    })
    .catch(error => console.log(error));
}

getAllObjetcs();
getAllCategories();

//Metodo para agregar una nueva fila
const addRow = ({id, name, image, category, description}, index) => {
    idTbody.innerHTML = idTbody.innerHTML + `
        <tr class = "main__table--tr">
            <td class = "main__table--td" id-value = "${id}">${index+1}</td>
            <td class = "main__table--td">${name}</td>
            <td class = "main__table--td">${description}</td>
            <td class = "main__table--td">${category.name}</td>
            <td class = "main__table--td">
                <img 
                    src = "${image}" 
                    alt = "icono"
                    class = "main__table--img"
                >
            </td>
            <td class = "main__table--td">
                <span class = "main__table--span">
                    <img src = "./img/delete.svg" class = "icon__option" option = "delete">
                </span>
                <span class = "main__table--span" style = "background-color: blue" option = "edit">
                    <img src = "./img/edit.svg" class = "icon__option" option = "edit">
                </span>
            </td>
        </tr>
    `;
}


const deleteRow = () => {
    idButtonDelete.addEventListener('click', (e) => {
        console.log(e.target.getAttribute('id-value'));
        fetch(`${url}/${e.target.getAttribute('id-value')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response=> response.json())
            .then(data => {
                idModalDelete.classList.add('close-modal-delete');
                idModalDelete.classList.remove('open-modal-delete');
                getAllObjetcs();
            })
            .catch(error => console.log(error));
    });
}
deleteRow();
openDeleteRow();
