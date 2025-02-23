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
const backgroundGradient = document.querySelector('.background-gradient');
const addBackgroundColor = document.getElementById('add-background-color');
const backgroundColor_list = document.querySelector('.background-color__list');
const imageDataBox = document.getElementById('image-data');
const imagePreview = document.getElementById('image-preview');
const backgroundListItemTemplate = document.getElementById('backgroundColor-list-item');

// Event Listeners
// Window load event listener
window.addEventListener('load', function() {
		// initiate placeholder
		let value = document.querySelector('input[name="placeholderType"]:checked').value;		
		let placeholder__text = document.querySelector('.placeholder__text');
		if (value === 'default') {
			placeholder__text.children.placeholderText.disabled = true;
			placeholder__text.style.height = "0px";
		} else {
			placeholder__text.children.placeholderText.disabled = false;
			placeholder__text.style.height = "auto";
		}

		// initiate background type
		value = document.querySelector('input[name="backgroundType"]:checked').value;		
		if (value === 'plain') {
				addBackgroundColor.disabled = true;	
				addBackgroundColor.style.display = 'none';
				backgroundGradient.style.display = 'none';
		} else {
				addBackgroundColor.disabled = false;
				addBackgroundColor.style.display = 'block';
				backgroundGradient.style.display = 'grid';
		}
		resetBackgroundColorList(value);	
}, false);
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
		if (value === 'plain') {
				addBackgroundColor.disabled = true;	
				addBackgroundColor.style.display = 'none';
				backgroundGradient.style.display = 'none';
		} else {
				addBackgroundColor.disabled = false;
				addBackgroundColor.style.display = 'block';
				backgroundGradient.style.display = 'grid';
		}
		resetBackgroundColorList(value);			
	});
}); 
// Add background color button event lister 
addBackgroundColor.addEventListener('click', function(event) {
	let __backgroundTypeChecked = document.querySelector('input[name=backgroundType]:checked');
	if (__backgroundTypeChecked != null && __backgroundTypeChecked.value == 'gradient') {		
		addBackgroundColorListItem();
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
// Background color input change event listener
document.body.addEventListener('change', function(event) {
	let target = event.target.closest('.backgroundColor');
	let referenceNumber = 0;
	if (target != null) {
		referenceNumber = target.parentElement.parentElement.dataset.reference;
		let backgroundColor = document.getElementById(`backgroundColor-input-${referenceNumber}`);
		let value = backgroundColor.value;
		if (isValidColor(value)) {
			let backgroundColorValue = document.getElementById(`backgroundColorValue-input-${referenceNumber}`);
			backgroundColorValue.value = value;
		}
	}
});
// Background color value input change event listener
document.body.addEventListener('input', function(event) {
	let target = event.target.closest('.backgroundColorValue');
	let referenceNumber = 0;
	if (target != null) {
		referenceNumber = target.parentElement.parentElement.dataset.reference;
		let backgroundColorValue = document.getElementById(`backgroundColorValue-input-${referenceNumber}`);
		let value = backgroundColorValue.value;
		if (isValidColor(value)) {
			let backgroundColor = document.getElementById(`backgroundColor-input-${referenceNumber}`);
			backgroundColor.value = value;
		}
	}
});
// Image data textarea click event listener
imageDataBox.addEventListener('click', async function(event) {
	try {
		let text = event.target.value;
		await navigator.clipboard.writeText(text);		
	} catch(error) {
		console.error(error);
		alert('Unable to copy\nCopy manually');
	}
	alert('Data URL copied to clipboard');
});  
// Image preview click event listener
imagePreview.addEventListener('click', async function(event) {
	try {
		let imageDataURL = event.target.src;
		const blob = await (await fetch(imageDataURL)).blob();
		await navigator.clipboard.write([
			new ClipboardItem({
				[blob.type]: blob
			})
		]);
	} catch(error) {
		console.error(error);
		alert('Unable to copy\nPrefer to download');
	}
	alert('Image copied to clipboard')
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
  let downloadButton = document.getElementById('download-button');
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

  if (placeholderType_input == 'custom') {
    placeholderText = placeholderText_input;
  }
  // canvas for dummy image generation
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");

  // sets canvas dimension
  canvas.width = width_input;
  canvas.height = height_input;

  let __backgroundTypeChecked = document.querySelector('input[name="backgroundType"]:checked').value;
  let backgroundColor = '';

  // set plain background color
  if (__backgroundTypeChecked == 'plain') {
  	for (let child of backgroundColor_list.querySelectorAll('li.item')) {
  		 backgroundColor = child.querySelector('.backgroundColor').value;
  		 break;
  	}
  	canvasContext.fillStyle = backgroundColor;
  }

  // set gradient background
  if (__backgroundTypeChecked == 'gradient') {
  	let gradient = null;
  	let gradientDirection = document.querySelector('input[name="backgroundGradient"]:checked');
  	gradientDirection = (gradientDirection == null) ? 'diagonal' : gradientDirection.value;

  	if (gradientDirection == 'horizontal') {
  		gradient = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
  	}
  	if (gradientDirection == 'vertical') {
  		gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.height);
  	}
  	if (gradientDirection == 'diagonal') {
  		gradient = canvasContext.createLinearGradient(0, 0, canvas.width, canvas.height);
  	}

  	let children = backgroundColor_list.querySelectorAll('li.item');
  	let stopFactor = 1/children.length;
  	let stopValue = 0;
  	for (let child of children) {
  		gradient.addColorStop(stopValue, child.querySelector('.backgroundColor').value);
  		stopValue += stopFactor; 
  	}
  	canvasContext.fillStyle = gradient;
  }

  // set font style
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
  
  // measure font size
  const textWidth = canvasContext.measureText(placeholderText).width;
  const scaleFactor = canvas.width / textWidth;
  fontSize *= scaleFactor;

	// adjust font size to prevent overflow when placeholder text is not an empty
  if (placeholderText.trim() != "") {
	  while(canvasContext.measureText(placeholderText).width < (canvas.width * 0.5)) {
	  	fontSize +=1;
	  	canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
	  }

	  while(canvasContext.measureText(placeholderText).width > (canvas.width * 0.5)) {
	  	fontSize -=1;
	  	canvasContext.font = `bold ${fontSize}px system-ui, Segoe UI, Roboto, Arial`;
	  }
	}

  // set placeholder text
  canvasContext.fillStyle = textColor_input;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";

  canvasContext.fillText(placeholderText, canvas.width / 2, canvas.height / 2);

  // generates data URL for image
  const dataUrl = canvas.toDataURL();

  imageDataBox.innerText = dataUrl;
  imagePreview.src = dataUrl;
  downloadButton.href = dataUrl;
  downloadButton.download = fileName;  

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
function addBackgroundColorListItem() {	
	let referenceNumber = parseInt(backgroundColor_list.querySelector('li.item:last-child').dataset.reference);
	referenceNumber++;
	let clone = backgroundListItemTemplate.content.cloneNode(true);
	clone.querySelector('li.item').dataset.reference = referenceNumber;
	reference = clone.querySelector('input.backgroundColor').id;
	reference += `-${referenceNumber}`;
	clone.querySelector('input.backgroundColor').id = reference;
	clone.querySelector('input.backgroundColor').name = reference;
	reference = clone.querySelector('input.backgroundColorValue').id;
	reference += `-${referenceNumber}`;
	clone.querySelector('input.backgroundColorValue').id = reference; 
	clone.querySelector('input.backgroundColorValue').name = reference; 
	backgroundColor_list.appendChild(clone);
	clone = null;
	return true;
}

// function to reset background color list item
function resetBackgroundColorList(_bgType) {
	// remove any children	
	for(let child of backgroundColor_list.querySelectorAll('li.item')) {
		backgroundColor_list.removeChild(child);
	}
	// add new child
	let reference = '';
	let clone = backgroundListItemTemplate.content.cloneNode(true);
	clone.querySelector('li.item').dataset.reference = 1;
	reference = clone.querySelector('input.backgroundColor').id;
	reference += '-1';
	clone.querySelector('input.backgroundColor').id = reference;
	clone.querySelector('input.backgroundColor').name = reference;
	reference = clone.querySelector('input.backgroundColorValue').id;
	reference += '-1';
	clone.querySelector('input.backgroundColorValue').id = reference; 
	clone.querySelector('input.backgroundColorValue').name = reference; 

	if (_bgType == 'plain') {
		clone.querySelector('.remove-current-list-button').style.display = 'none';
	}

	backgroundColor_list.appendChild(clone);
	clone = null;

	return true;
}