const path = require('path');
const remote = require('@electron/remote')
const { Menu, dialog } = remote;
const request = require('request');
const PPTX = require('nodejs-pptx');
const fs = require('fs')
var FormData = require('form-data');

const container = document.getElementById('slides');
const openButton = document.getElementById('openPres')
global.filepath = undefined;
global.isMainDialogOpen = false;

async function getFileScreenShots(file) {
    var formData = new FormData();
    formData.append('file', fs.createReadStream(global.filepath));
    formData.submit('http://localhost:5000', function(err, res) {
        res.on('data', function (data) {
            var jsonObject = JSON.parse(data);
            container.innerHTML = '';
            for(var i = 0; i < jsonObject.length; i++) {
                console.log(jsonObject[i])
                appendImageToScreen(jsonObject[i])
            }
       });
        res.resume();
    });
}

async function appendImageToScreen(image_name) {
    var date = new Date()
    var img = document.createElement("img");
    img.style.width = '25vw';
    img.style.height = 'auto';
    img.src = "http://localhost:5000"+"/images/"+image_name+'?dummy='+date.getTime();
    container.appendChild(img);
}

openButton.addEventListener('click', () => {
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
                getFileScreenShots(file);
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


