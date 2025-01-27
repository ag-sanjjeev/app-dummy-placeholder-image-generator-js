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

// Global constants
const placeholderType = document.querySelectorAll('input[name="placeholderType"]');
const textColor = document.querySelector('input[name="textColor"]');
const textColorValue = document.querySelector('input[name="textColorValue"]');
const backgroundType = document.querySelectorAll('input[name="backgroundType"]');
const addBackgroundColor = document.getElementById('add-background-color');
const backgroundColor_list = document.querySelector('.background-color__list');
const backgroundListItemTemplate = document.getElementById('backgroundColor-list-item');

// Event Listeners
// Placeholder radio change event listener
placeholderType.forEach(function(element) {
	element.addEventListener('change', function(event) {
		let value = event.target.value;
		let placeholder__text = document.querySelector('.placeholder__text');
		if (value === 'default') {
			placeholder__text.children.placeholderText.disabled = true;
			placeholder__text.style.height = "0px";
		} else {
			placeholder__text.children.placeholderText.disabled = false;
			placeholder__text.style.height = "auto";
		}
	});
});
// Text color picker input event listener
textColor.addEventListener('change', function(event) {
	let value = event.target.value;
	if (isValidColor(value)) {
		textColorValue.value = value;
	}
});
// Text color value input event listener
textColorValue.addEventListener('input', function(event) {
	let value = event.target.value;
	if (isValidColor(value)) {
		textColor.value = value;
	}
});
// Background type radio change event lister
backgroundType.forEach(function(element) {
	element.addEventListener('change', function(event) {
		let value = event.target.value;
		let background_color = document.querySelector('.background-color');
		if (value === 'plain') {
				addBackgroundColor.disabled = true;	
		} else {
				addBackgroundColor.disabled = false;
		}
		resetBackgroundColorList(value);			
	});
}); 
// Add background color button event lister 
addBackgroundColor.addEventListener('click', function(event) {
	let __backgroundTypeChecked = document.querySelector('input[name=backgroundType]:checked');
	if (__backgroundTypeChecked != null) {		
		addBackgroundColorListItem(__backgroundTypeChecked.value);
	}
	return false;
});
// Remove current background color list item button event listener
document.body.addEventListener('click', function(event) {
	let target = event.target.closest('.remove-current-list-button');
	if (target != null) {
		let parent = target.parentElement;	
		backgroundColor_list.removeChild(parent);	
	}
});


// function to generate dummy image
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

// function to check valid hexadecimal color code
function isValidColor(hexCode) {
	let validation = false;
	let re = null;
	
	re = /^#[0-9a-fA-F]{3}$/i;
	if (re.test(hexCode)) {
		return true;
	}

	re = /^#[0-9a-fA-F]{6}$/i;
	if (re.test(hexCode)) {
		return true;
	}

	re = /^#[0-9a-fA-F]{6}[0-9a-fA-F]{0,2}$/i;
	if (re.test(hexCode)) {
		return true;
	}

	return false;
}

// function to add background color list item
function addBackgroundColorListItem(backgroundType) {	
	
}

// function to reset background color list item
function resetBackgroundColorList(_bgType) {
	if (_bgType == 'plain') {
		// remove any children	
		for(let child of backgroundColor_list.children) {
			backgroundColor_list.removeChild(child);
		}
		// add new child
		let clone = backgroundListItemTemplate.content.cloneNode(true);
		backgroundColor_list.appendChild(clone);
		clone = null;

		return true;
	}

	if (_bgType == 'gradient') {
		// remove any children	
		for(let child of backgroundColor_list.children) {
			backgroundColor_list.removeChild(child);
		}
		// add new child
		let id = '';
		let clone = backgroundListItemTemplate.content.cloneNode(true);		
		id = clone.querySelector('input[name="backgroundColor"]').id;
		clone.querySelector('input[name="backgroundColor"]').id = id + '-1';
		id = clone.querySelector('input[name="backgroundColorValue"]').id;
		clone.querySelector('input[name="backgroundColorValue"]').id = id + '-1'; 
		backgroundColor_list.appendChild(clone);
		clone = null;

		return true;
	}

	return false;
}