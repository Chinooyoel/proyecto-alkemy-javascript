window.onload = () => {
    open_container_home();
    eventListOperations();
    eventOpenHome();
    validate_form(document.getElementById("formUpdate"), document.getElementById("alertUpdate"));
    validate_form(document.getElementById("formRegister"), document.getElementById("alertRegister"));
}

let list_operations = ( callback ) => {
    let xhttp = new XMLHttpRequest();

    //we look for the api list
    xhttp.onreadystatechange = function () {
        if( xhttp.readyState === 4 && xhttp.status === 200 ){

            let result = JSON.parse(this.responseText);
            operations = result["operations"];
            callback(null, result["operations"]);
        }
    }

    xhttp.open("GET", "list-operations");
    xhttp.send();
}


let show_container_home = () => {
    let list_operations_home = document.getElementById("listOperations_home");
    let result_home = document.getElementById("result_home");

    list_operations( ( error, operations  ) => {
        //if there are no registered operations
        if( operations.length === 0 ){
            list_operations_home.innerHTML = `No hay operaciones registradas`,
            result_home.innerHTML = `$0.00`;
            return;
        }

        //we calculate the budget, adding and subtracting operations
        let budget = calculate_budget( operations );


        //we write the last 10 operations in the html list
        list_operations_home.innerHTML = `
            <tr>
                <th class="bg-success">#</th>
                <th class="bg-success">Concepto</th>
                <th class="bg-success">Fecha</th>
                <th class="bg-success">Tipo</th>
                <th class="bg-success">Monto</th>
            </tr>
            `;
        for( let i = show_10_operations( operations.length ); i < operations.length ; i++ ){
            list_operations_home.innerHTML += `
                    <tr class="table-success">
                        <td>${operations[i].id} </td>
                        <td>${operations[i].concept}</td>
                        <td>${operations[i].date_operation.split("T")[0]}</td>
                        <td>${operations[i].type_operation}</td>
                        <td>$${operations[i].amount}</td>
                    </tr>
                    `;
        }
        
        result_home.innerHTML = `$${ budget }.00`

    })
}

let calculate_budget = ( operations ) => {
    let budget = 0;

    for( let i = 0; i < operations.length ; i++ ){
        
        if( operations[i].type_operation === "Ingreso" ){
            budget += operations[i].amount;
        }else{
            budget -= operations[i].amount;
        }
    }
    return budget;
}

let show_10_operations = ( number_operations ) => {
    if( number_operations < 10 ){
        return 0;
    }

    return number_operations - 10;
}

let show_container_listOperations = () => {
    let list_operations_income = document.getElementById("listOperations_income");
    let list_operations_expenses = document.getElementById("listOperations_expenses");

    list_operations( ( error, operations  ) => {
        
        //if there are no registered operations
        if( operations.length === 0 ){
            list_operations_income.innerHTML = `No hay ingresos`;
            list_operations_expenses.innerHTML = `No hay egresos`;
            return;
        }


        //we list the operations separated by income and expenses
        list_operations_income.innerHTML = `
            <tr>
                <th class="bg-success">#</th>
                <th class="bg-success">Concepto</th>
                <th class="bg-success">Fecha</th>
                <th class="bg-success">Monto</th>
                <th class="bg-success">Accion</th>
            </tr>
            `;
        list_operations_expenses.innerHTML = `
            <tr>
                <th class="bg-danger">#</th>
                <th class="bg-danger">Concepto</th>
                <th class="bg-danger">Fecha</th>
                <th class="bg-danger">Monto</th>
                <th class="bg-danger">Accion</th>
            </tr>
            `;
        for( let i = 0; i < operations.length ; i++ ){
            if( operations[i].type_operation === "Ingreso"){
                list_operations_income.innerHTML += 
                `<tr class="table-success">
                    <td>${operations[i].id}</td>
                    <td name="concept">${operations[i].concept}</td>
                    <td name="date_operation">${operations[i].date_operation.split("T")[0]}</td>
                    <td>$<span name="amount">${operations[i].amount}</span>.00</td>
                    <td>
                        <button data-id="${operations[i].id}" class="update_operation btn btn-success">Actualizar</button>
                        <button data-id="${operations[i].id}" class="delete_operation btn btn-danger">Eliminar</button>
                    </td>
                </tr>`
            }else{
                list_operations_expenses.innerHTML += 
                `<tr class="table-danger">
                    <td>${operations[i].id}</td>
                    <td name="concept">${operations[i].concept}</td>
                    <td name="date_operation">${operations[i].date_operation.split("T")[0]}</td>
                    <td>$<span name="amount">${operations[i].amount}</span>.00</td>
                    <td>
                        <button data-id="${operations[i].id}" class="update_operation btn btn-success">Actualizar</button>
                        <button data-id="${operations[i].id}" class="delete_operation btn btn-danger">Eliminar</button>
                    </td>
                </tr>`
            }
        }
        //We put the delete buttons to listen to a click
        delete_operation_event();
        //We put the update buttons to listen to a click
        update_operation_event();
    })
}

let delete_operation_event = () => {
    let buttons_delete_operation = document.getElementsByClassName("delete_operation");

    //if we click, it deletes the operation that is searched for by its id
    for( let i = 0; i < buttons_delete_operation.length; i++ ){
        buttons_delete_operation[i].addEventListener("click", ( e ) => {
            let idOperation = e.target.dataset.id;

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function(){
                if( xhttp.readyState == 4 && xhttp.status == 200 ){
                    open_container_listOperations();
                }
            }
            xhttp.open("POST", `delete-operation/${idOperation}`);
            xhttp.send();
        })
    }
    

}

let update_operation_event = () => {
    let buttons_update_operation = document.getElementsByClassName("update_operation");

    //if we click, it sends us to the update form with the established values
    for( let i = 0; i < buttons_update_operation.length; i++ ){
        buttons_update_operation[i].addEventListener("click", ( e ) => {
            let id = e.target.dataset.id;



            //we look for the properties of the operation in the list element
            let concept = e.target.parentNode.parentNode.parentNode.querySelector("[name='concept']").innerHTML;
            let date_operation = e.target.parentNode.parentNode.parentNode.querySelector("[name='date_operation']").innerHTML;
            let amount = e.target.parentNode.parentNode.parentNode.querySelector("[name='amount']").innerHTML;

            let operation = {
                id,
                concept,
                date_operation,
                amount
            }
            //we send the operation to show it in the form
            show_container_form_update( operation );
            open_container_updateOperation();
        })
    }
    

}

let show_container_form_update = ( operation ) => {
    let form_update = document.getElementById("formUpdate");

    //we set the values in the input
    form_update.querySelector("[name='concept']").value = operation.concept;
    form_update.querySelector("[name='date_operation']").value = operation.date_operation;
    form_update.querySelector("[name='amount']").value = operation.amount;

    //add the action
    form_update.action = `/update-operation/${operation.id}`;

}


let open_container_home = () => {
    //we show the home window
    document.getElementById("container_home").style.display = "flex";
    show_container_home();
    //we hide the other windows
    document.getElementById("container_listOperations").style.display = "none";
    document.getElementById("container_updateOperation").style.display = "none";
}

let open_container_listOperations = () => {
    //we show the listOperation window
    document.getElementById("container_listOperations").style.display = "block";
    show_container_listOperations()
    //we hide the other windows
    document.getElementById("container_home").style.display = "none";
    document.getElementById("container_updateOperation").style.display = "none";
}

let open_container_updateOperation = () => {
    //we show the updateOperation window
    document.getElementById("container_updateOperation").style.display = "block";
    //we hide the other windows
    document.getElementById("container_home").style.display = "none";
    document.getElementById("container_listOperations").style.display = "none";
}

let eventListOperations = () => {
    let btn = document.getElementById("btn_showList");

    btn.addEventListener("click", () => {
        open_container_listOperations();
    })
}

let eventOpenHome = () => {
    let btn = document.getElementById("btn_openHome");

    btn.addEventListener("click", () => {
        open_container_home();
    })
}

let validate_form = ( form, alert ) => {
    form.addEventListener("submit", ( e ) => {
        e.preventDefault();

        //we validate fields
        if( form.querySelector("[name='concept']").value.trim() == "" || form.querySelector("[name='date_operation']").value.trim == '' 
            || form.querySelector("[name='amount']").value.trim() == '' )
        {
            alert.style.display="block";
            return;
        }
        //we take out the alert
        alert.style.display="none";

        form.submit();
    })
}
