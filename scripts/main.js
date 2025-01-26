/*
 *  Dummy Image Generator
 *  
 *  Copyright 2025 ag-sanjjeev               		
 * 
 *  The source code is licensed under  MIT-style 
 *  License. The usage, permission and condition 
 *  are applicable  to  this source code  as per 		
 *  license.  That can be found in  LICENSE file
 *  or at https://opensource.org/licenses/MIT.			
 * 
 */

function generateDummyImage(form) {	
  let width_input = form.width.value;
  let height_input = form.height.value;
  let placeholderType_input = form.placeholderType.value;
  let placeholderText_input = form.placeholderText.value;
  let textColor_input = form.textColor.value;
  let textColorValue_input = form.textColorValue.value;
  let backgroundType_input = form.backgroundType.value;
  let backgroundColor_input = form.backgroundColor.value;
  let backgroundColorValue_input = form.backgroundColorValue.value;
  let imageDataBox = document.getElementById('image-data');
  let imagePreview = document.getElementById('image-preview');
  let fontSize = 20; // in pixel

  let fileName = `${width_input}x${height_input}`;
  let placeholderText = fileName;


  // Dimension Validation
  if (width_input < 10 || width_input > 16000) {
    return false;
  }
  if (height_input < 10 || height_input > 16000) {
    return false;
  }
  
  // text color validation
  if (textColor_input.toUpperCase() !== textColorValue_input.toUpperCase()) {
  	return false;
  }

  // background color validation
  if (backgroundColor_input.toUpperCase() !== backgroundColorValue_input.toUpperCase()) {
  	return false;
  }

  if (placeholderType_input == 'custom' && placeholderText_input.trim() == "") {
    placeholderText = placeholderText_input;
  }
  // canvas for dummy image generation
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");

  canvas.width = width_input;
  canvas.height = height_input;

  canvasContext.fillStyle = backgroundColor_input;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
  
  // measure font size
  const textWidth = canvasContext.measureText(placeholderText).width;
  const scaleFactor = canvas.width / textWidth;
  fontSize *= scaleFactor;

  // adjust font size to prevent overflow
  while(canvasContext.measureText(placeholderText).width < (canvas.width * 0.5)) {
  	fontSize +=1;
  	canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
  }

  while(canvasContext.measureText(placeholderText).width > (canvas.width * 0.5)) {
  	fontSize -=1;
  	canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
  }

  canvasContext.fillStyle = textColor_input;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";

  canvasContext.fillText(placeholderText, canvas.width / 2, canvas.height / 2);

  const dataUrl = canvas.toDataURL();

  imageDataBox.innerText = dataUrl;
  imagePreview.src = dataUrl;
  imagePreview.href = dataUrl;
  imagePreview.download = fileName;  

  return true;
}