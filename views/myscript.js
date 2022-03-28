function updateproduct(e,id)
{ 
    console.log("update function called ....");
e.preventDefault();
var updateProduct={
    nameofthefood:document.editform.nameofthefood.value,
    numberofpeopleeat:document.editform.numberofpeopleeat.value,
    price:document.editform.price.value,
    remarks:document.editform.remarks.value,
    location:document.editform.location.value,
    delivery:document.editform.delivery.value
                }
fetch(" https://food-devi-123.herokuapp.com/updateproduct/"+id,
{
 method:'PUT',
 headers:
 {
     'Content-Type':'application/json',
 },
 body:JSON.stringify(updateProduct),
}).then(res=>{window.location.href=" https://food-devi-123.herokuapp.com/home"})         
}
// function deleteproduct(id)
// {
//    alert(id)
//    console.log("delete method is called..")
//    fetch("http://localhost:3600/deleteproduct/"+id,
//    {
//        method:'DELETE',
//    }).then(res=>{window.location.href="http://localhost:3600/home"})
// }
