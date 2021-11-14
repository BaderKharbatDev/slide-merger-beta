const path = require('path');
const remote = require('@electron/remote')
const { Menu, dialog } = remote;
const request = require('request');
const PPTX = require('nodejs-pptx');
const fs = require('fs')
var FormData = require('form-data');

const menuSlides = document.getElementById('main-slides');
const menuButton = document.getElementById('menu_button_load')
const menuWorkplaceButton = document.getElementById('menu_button_workplace_pptx')
const domain = "http://localhost:5000";

global.filepath = undefined;
global.isMainDialogOpen = false;
global.isSubDialogOpen = false;

async function getFileScreenShots(file, isMainSlide) {
    var formData = new FormData();
    formData.append('file', fs.createReadStream(global.filepath));
    formData.submit(domain, function(err, res) {
        res.on('data', function (data) {
            var jsonObject = JSON.parse(data);
            if(isMainSlide) { //add images to main
                menuSlides.innerHTML = '';
                for(var i = 0; i < jsonObject.length; i++) {
                    console.log(jsonObject[i])
                    appendImageToMain(jsonObject[i])
                }
            } else { //add images to sub

            }
       });
        res.resume();
    });
}

async function appendImageToMain(image_name) {
    var date = new Date()
    var img = document.createElement("img");
    img.src = domain+"/images/"+image_name+'?dummy='+date.getTime();
    
    img.className = 'main_slide_img';
    menuSlides.appendChild(img);
}

async function appendImageToSub(image_name, workplace_index) {
    var date = new Date()
    var img = document.createElement("img");
    img.src = domain+"/images/"+image_name+'?dummy='+date.getTime();

    // var tempSlide = document.getElementById('test');
    // img.className = "workspace_div_slides_img";
    // tempSlide.appendChild(img);
}


menuButton.addEventListener('click', () => {
    if(global.isMainDialogOpen) {
        return
    }
    global.isMainDialogOpen = true;
    // If the platform is 'win32' or 'Linux'
      if (process.platform !== 'darwin') {
          // Resolves to a Promise<Object>
          dialog.showOpenDialog({
              title: 'Select the File to be uploaded',
              defaultPath: path.join(__dirname, '../assets/'),
              buttonLabel: 'Upload',
              // Restricting the user to only Text Files.
              filters: [
                  {
                      name: 'PowerPoint Files',
                      extensions: ['pptx']
                  }, ],
              // Specifying the File Selector Property
              properties: ['openFile']
          }).then(file => {
              global.isMainDialogOpen = false
              if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                getFileScreenShots(file, true);
              }  
          }).catch(err => {
              console.log(err)
          });
      }
      else {
          // If the platform is 'darwin' (macOS)
          dialog.showOpenDialog({
              title: 'Select the File to be uploaded',
              defaultPath: path.join(__dirname, '../assets/'),
              buttonLabel: 'Upload',
              filters: [
                  {
                    name: 'PowerPoint Files',
                    extensions: ['pptx']
                  }, ],
              properties: ['openFile', 'openDirectory']
          }).then(file => {
            global.isMainDialogOpen = false
            if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                getFileScreenShots(file);
              }  
          }).catch(err => {
              console.log(err)
          });
      }
});

menuWorkplaceButton.addEventListener('click', () => {
    if(global.isSubDialogOpen) {
        return
    }
    global.isSubDialogOpen = false;
    // If the platform is 'win32' or 'Linux'
      if (process.platform !== 'darwin') {
          // Resolves to a Promise<Object>
          dialog.showOpenDialog({
              title: 'Select the File to be uploaded',
              defaultPath: path.join(__dirname, '../assets/'),
              buttonLabel: 'Upload',
              // Restricting the user to only Text Files.
              filters: [
                  {
                      name: 'PowerPoint Files',
                      extensions: ['pptx']
                  }, ],
              // Specifying the File Selector Property
              properties: ['openFile']
          }).then(file => {
              global.isMainDialogOpen = false
              if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                getFileScreenShots(file, false);
              }  
          }).catch(err => {
              console.log(err)
          });
      }
      else {
          // If the platform is 'darwin' (macOS)
          dialog.showOpenDialog({
              title: 'Select the File to be uploaded',
              defaultPath: path.join(__dirname, '../assets/'),
              buttonLabel: 'Upload',
              filters: [
                  {
                    name: 'PowerPoint Files',
                    extensions: ['pptx']
                  }, ],
              properties: ['openFile', 'openDirectory']
          }).then(file => {
            global.isMainDialogOpen = false
            if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                getFileScreenShots(file);
              }  
          }).catch(err => {
              console.log(err)
          });
      }
});

// const make = async function() {
//     let pptx = new PPTX.Composer();

//     await pptx.compose(pres => {
//       pres.addSlide(slide => {
//         slide.addText(text => {
//           text.value('Hello World');
//         });
//       });
//     });
    
//     await pptx.save(`./hello-world.pptx`);
// }

// make();


