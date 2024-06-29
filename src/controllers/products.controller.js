import service from '../services/products.service.js'

async function createProduct(req, res, next){
    const fields = req.body
    const call = await service.createProduct(fields)
    if(!call){
        return res.status(200).send('Missing fields.')
    }else if(call === 1){
        return res.status(200).send('Code already exists.')
    }

    return res.status(200).send('Product created.')
}

async function updateProduct(req, res, next){
    const fields = req.body
    const call = await service.updateProduct(fields)

    if(!call){
        return res.status(200).send('Product doesn`t found.')
    }else if(call === 1){
        return res.status(200).send('You can not change the code of the product.')
    }

    return res.status(200).send('Modified.')
}

async function deleteProduct(req, res, next){
    const id = req.body.id
    const call = await service.deleteProduct(id)
    if(!call){
        return res.status(200).send('Product doesn`t found.')
    }

    return res.status(200).send('Product deleted.')
}

async function totalPages(req, res, next){
    
}

async function getProduct(req, res, next){
    const id = req.body.id
    const call = await service.getProduct(id)
    console.log(call);
    if(!call){
        return res.status(200).send('Product don`t found.')
    }
    return res.send(call)
}

async function getAll(req, res, next){
    const call = await service.getAll()
    if(call.length < 1){
        return res.status(200).send('Unexpected error has occurred.')
    }
    return res.send(call)
}


export default{
    createProduct,
    updateProduct,
    deleteProduct,
    totalPages,
    getProduct,
    getAll
}