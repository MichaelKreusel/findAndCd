#!/bin/env node
const fs = require('fs')
const options = { withFileTypes: true }

module.exports = innerSearch = (folderToFind, folderToSearch) => { // TODO maybe add maxDepth
    const regex = new RegExp(`^.*${folderToFind}.*$`)
    let foldersToReturn = []
    for (let inode of fs.readdirSync(folderToSearch, options)) {
        if (inode.isDirectory()) {
            if (inode.name === folderToFind || inode.name.startsWith(folderToFind) || regex.test(inode.name))
                foldersToReturn.push(`${folderToSearch}/${inode.name}`)
            else if (
                    !fs.existsSync(`${folderToSearch}/${inode.name}/.git`) && 
                    !fs.existsSync(`${folderToSearch}/${inode.name}/node_modules`) &&
                    !fs.existsSync(`${folderToSearch}/${inode.name}/venv`) // TODO better solution
                ) {
                    foldersToReturn.push(...innerSearch(folderToFind, `${folderToSearch}/${inode.name}`))
            }
        }
    }
    return foldersToReturn
}