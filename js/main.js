import productdb, {
    bulkcreate,
    getData,
    createEle
} from './Module.js';

let db = productdb("productDB", {
    products: '++id,name,seller,price'
});

// input tags
const userid = document.getElementById("userid");
const productname = document.getElementById("productname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

//buttons
const btncreate = document.getElementById("bnt-create");
const btnread = document.getElementById("bnt-read");
const btnupdate = document.getElementById("bnt-update");
const btndelete = document.getElementById("bnt-delete");


//not found
const notfound = document.getElementById("notfound");

//create event on create button
btncreate.onclick = (event) =>{
   let flag = bulkcreate(db.products, {
        name: productname.value,
        seller: seller.value,
        price: price.value
    })
    console.log(flag);

    clear();

    getData(db.products, (data)=>{
        userid.value = data.id + 1 || 1;
    });

    table();
}

//create event on read button
btnread.onclick = table;

//create event on update button
btnupdate.onclick = ()=>{
    const id = parseInt(userid.value || 0);
    if (id){
        db.products.update(id, {
            name: productname.value,
            seller: seller.value,
            price: price.value
        }).then((updated)=>{
            let get = updated ? `data Updated` : `Couldn't update data`;
         
        })
    }
    clear();
    table();
}

//create event on delete button
btndelete.onclick = ()=>{
    db.delete();
    db = productdb("productDB", {
        products: '++id,name,seller,price'
    });
    db.open();

    clear();
    table();
    textID(userid);
}


//window onload event
window.onload=()=>{
    textID(userid);
}

function textID(textboxid){
    getData(db.products, data=>{
        textboxid.value = data.id + 1|| 1;
    })
}

//clear textbox
function clear(){
    productname.value = "";
    seller.value = "";
    price.value = "";
}

function table(){
    const tbody = document.getElementById("tbody");

    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }
    getData(db.products,(data)=>{
        if(data){
            createEle("tr", tbody, tr =>{
              for (const value in data) {
                 createEle("td", tr, td =>{
                     td.textContent = data.price === data[value]? `P ${data[value]}`: data[value];
                 })
              } 
              createEle("td", tr, td=>{
                  createEle("i", td, i =>{
                      i.className+="fas fa-edit btnedit"
                      i.setAttribute(`data-id`, data.id);
                      i.onclick = editbtn;
                  })
              }) 
              createEle("td", tr, td=>{
                createEle("i", td, i =>{
                    i.className+="fas fa-trash-alt btndelete"
                    i.setAttribute(`data-id`, data.id);
                    i.onclick = deletebtn;
                })
              }) 
            })
        }else{
            notfound.textContent = "No record found in the database."
        }
    })
}

function editbtn(event){
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, data=>{
        userid.value = data.id || 0;
        productname.value = data.name || 0;
        seller.value = data.seller || 0;
        price.value = data.price || 0;
    })
}

function deletebtn(event){
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);

    table();
}
