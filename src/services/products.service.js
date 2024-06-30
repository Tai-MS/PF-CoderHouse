import productsClass from '../persistence/products.persistence.js'
import userClass from '../persistence/user.persistence.js'

async function createProduct(fields){
    const {title, description, code, price, status, stock, category,
        thumbnail, owner, user
    } = fields

    const userRole = await userClass.getUser(user)
    console.log(userRole);
    if(userRole.role === 'admin' || userRole.role === 'premium'){
        const existingCode = await productsClass.verifyCode(code)
    
        if(!title || !description || !code || !price || !category || !stock || !status){
            return 0
        }
    
        if(existingCode){
            console.log(1);
            return 1
        }
        
        if(!thumbnail){
            fields.thumbnail = 'No image'
        }
    
        
        fields.owner = userRole._id
        
    
        return productsClass.createProd(fields)
    }
    return 3
}

async function updateProduct(fields){
    const originalProd = await productsClass.getOne(fields.id)
    const prodCode = fields.code
    const originalCode = originalProd.code
    console.log("pc",originalProd);
    console.log("oc",originalCode);
    if(!originalProd){
        return 0
    }
    if(originalCode !== prodCode){
        return 1
    }

    if(prodCode){
        fields.code = originalCode
    }

    return await productsClass.updateprod(fields)

}

async function deleteProduct(id){
    const product = await productsClass.getOne(id)

    if(product){
        return await productsClass.deleteProd(id)
    }
    return 0
}

async function totalPages(req, res, next){
    
}

async function getProduct(id){
    const product = await productsClass.getOne(id)
    if(product.length < 1){
        return product
    }
    return 0
}

async function getAll(){
    return await productsClass.getAll()
}


export default{
    createProduct,
    updateProduct,
    deleteProduct,
    totalPages,
    getProduct,
    getAll
}