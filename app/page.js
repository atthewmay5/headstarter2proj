'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from './firebase'
import { Box, StyledEngineProvider, Skeleton, Typography, Modal, Stack, TextField, Button } from "@mui/material"
import { collection, query, QueryEndAtConstraint, setDoc, getDocs, doc, getDoc, setDocs, deleteDoc, where } from "firebase/firestore"
import { Quando } from "next/font/google"

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(true);
    const [itemCount, setItemCount] = useState(0);
    const [itemName,setItemName] = useState('')
    const [inventoryCopy, setInventoryCopy ] = useState([]);

    async function searchItem(value){
      const inventoryList = [];
  
      //if there is something in the input box
      if(value.length){
        const searchQuery = query(collection(firestore, "inventory"), where('__name__', '==', value));
        const searchDocs = await getDocs(searchQuery)
        searchDocs.forEach( doc => {
          inventoryList.push({
            name: doc.id,
            ...doc.data(),
          });
        })
        setInventory(inventoryList);
        setItemCount(inventoryList.length);
      }else{ //if there's nothing in the input box
        setInventory(inventoryCopy);
      }
    }

    const updateInventory = async() => {
      setLoading(true);
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      setLoading(false);
      const inventoryList = [];
      docs.forEach((doc)=>{
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
      setItemCount(inventoryList.length)
      setInventoryCopy(inventoryList);
      console.log(inventoryList)
    }

    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const {count} = docSnap.data()
        if(count===1){
          await deleteDoc(docRef)
        } else{
          await setDoc(docRef, {count: count-1})
        }
      }
      await updateInventory()
    }

    const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const {count} = docSnap.data()
        await setDoc(docRef, {count: count + 1})
      } else {
        await setDoc(docRef, {count: 1})
      }
      await updateInventory()
    }

    useEffect(()=>{
      updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

      return(
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        gap={2}
       > 
        <Modal
        open={open}
        onClose={handleClose}>

          <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{transform:"translate(-50%,-50%)",}}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}>

          <Typography variants="h6">Add Item</Typography>

          <Stack width="100%," direction="row" spacing={2}>

            <TextField variant="outlined" fullWidth value={itemName} onChange={(e)=>{setItemName(e.target.value)}}></TextField>

            <Button
            variant="outlined"
            onClick={()=>{
              addItem(itemName)
              setItemName("")
              handleClose()
            }}>
              Add
              </Button>

          </Stack>
          </Box>
        </Modal>
                
        <Button
        variant="contained"
        onClick={()=>{
          handleOpen()
        }}>
          Add Inventory
        </Button>

        <Box
        border="1px solid #333">
        <Box
        width="800px"
        height="100px"
        bgcolor="beige"
        alignContent="center"
        justifyContent="Center"
        display="flex"
        >
          <Typography variant="h2" color="#333">
          {isLoading ? (
              <Skeleton
                variant="rectangular"
                sx={{ bgcolor: "grey.900" }}
                width="800px"
                height="100px"
              />
            ) : (
              `Inventory List: ${itemCount}`
            )}
          </Typography>
        </Box>
        <Box>
          <input name="searchItems" className="searchInput" placeholder="Search Items" onChange={(e) => {
            let value = e.target.value;
            searchItem(value);
          }} />
        </Box>
        <Stack width="800px" height="800px" spacing={2} overflow="auto">
          {inventory.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {count}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  {" "}
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}

          {isLoading ? <Skeleton variant="rectangular" height={150} /> : ""}
        </Stack>
      </Box>
    </Box>
      )
}
