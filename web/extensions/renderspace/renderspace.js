import { app } from '../../scripts/app.js'
import { api } from '../../scripts/api.js'

const DEBOUNCE_QUEUE_INTERVAL_MS = 200

const resolutions = [
  { label: '1024 x 1024 (default)', width: 1024, height: 1024 },
  { label: '1152 x 896', width: 1152, height: 896 },
  { label: '896 x 1152', width: 896, height: 1152 },
  { label: '1216 x 832', width: 1216, height: 832 },
  { label: '832 x 1216', width: 832, height: 1216 },
  { label: '1344 x 768', width: 1344, height: 768 },
  { label: '768 x 1344', width: 768, height: 1344 },
  { label: '1536 x 640', width: 1536, height: 640 },
  { label: '640 x 1536', width: 640, height: 1536 },
]

const colors = [
  { color: '#787878', label: 'wall' },
  { color: '#B47878', label: 'building;edifice' },
  { color: '#06E6E6', label: 'sky' },
  { color: '#503232', label: 'floor;flooring' },
  { color: '#04C803', label: 'tree' },
  { color: '#787850', label: 'ceiling' },
  { color: '#8C8C8C', label: 'road;route' },
  { color: '#CC05FF', label: 'bed' },
  { color: '#E6E6E6', label: 'windowpane;window' },
  { color: '#04FA07', label: 'grass' },
  { color: '#E005FF', label: 'cabinet' },
  { color: '#EBFF07', label: 'sidewalk;pavement' },
  { color: '#96053D', label: 'person;individual;someone;somebody;mortal;soul' },
  { color: '#787846', label: 'earth;ground' },
  { color: '#08FF33', label: 'door;double;door' },
  { color: '#FF0652', label: 'table' },
  { color: '#8FFF8C', label: 'mountain;mount' },
  { color: '#CCFF04', label: 'plant;flora;plant;life' },
  { color: '#FF3307', label: 'curtain;drape;drapery;mantle;pall' },
  { color: '#CC4603', label: 'chair' },
  { color: '#0066C8', label: 'car;auto;automobile;machine;motorcar' },
  { color: '#3DE6FA', label: 'water' },
  { color: '#FF0633', label: 'painting;picture' },
  { color: '#0B66FF', label: 'sofa;couch;lounge' },
  { color: '#FF0747', label: 'shelf' },
  { color: '#FF09E0', label: 'house' },
  { color: '#0907E6', label: 'sea' },
  { color: '#DCDCDC', label: 'mirror' },
  { color: '#FF095C', label: 'rug;carpet;carpeting' },
  { color: '#7009FF', label: 'field' },
  { color: '#08FFD6', label: 'armchair' },
  { color: '#07FFE0', label: 'seat' },
  { color: '#FFB806', label: 'fence;fencing' },
  { color: '#0AFF47', label: 'desk' },
  { color: '#FF290A', label: 'rock;stone' },
  { color: '#07FFFF', label: 'wardrobe;closet;press' },
  { color: '#E0FF08', label: 'lamp' },
  { color: '#6608FF', label: 'bathtub;bathing;tub;bath;tub' },
  { color: '#FF3D06', label: 'railing;rail' },
  { color: '#FFC207', label: 'cushion' },
  { color: '#FF7A08', label: 'base;pedestal;stand' },
  { color: '#00FF14', label: 'box' },
  { color: '#FF0829', label: 'column;pillar' },
  { color: '#FF0599', label: 'signboard;sign' },
  { color: '#0633FF', label: 'chest;of;drawers;chest;bureau;dresser' },
  { color: '#EB0CFF', label: 'counter' },
  { color: '#A09614', label: 'sand' },
  { color: '#00A3FF', label: 'sink' },
  { color: '#8C8C8C', label: 'skyscraper' },
  { color: '#FA0A0F', label: 'fireplace;hearth;open;fireplace' },
  { color: '#14FF00', label: 'refrigerator;icebox' },
  { color: '#1FFF00', label: 'grandstand;covered;stand' },
  { color: '#FF1F00', label: 'path' },
  { color: '#FFE000', label: 'stairs;steps' },
  { color: '#99FF00', label: 'runway' },
  { color: '#0000FF', label: 'case;display;case;showcase;vitrine' },
  { color: '#FF4700', label: 'pool;table;billiard;table;snooker;table' },
  { color: '#00EBFF', label: 'pillow' },
  { color: '#00ADFF', label: 'screen;door;screen' },
  { color: '#1F00FF', label: 'stairway;staircase' },
  { color: '#0BC8C8', label: 'river' },
  { color: '#FF5200', label: 'bridge;span' },
  { color: '#00FFF5', label: 'bookcase' },
  { color: '#003DFF', label: 'blind;screen' },
  { color: '#00FF70', label: 'coffee;table;cocktail;table' },
  {
    color: '#00FF85',
    label: 'toilet;can;commode;crapper;pot;potty;stool;throne',
  },
  { color: '#FF0000', label: 'flower' },
  { color: '#FFA300', label: 'book' },
  { color: '#FF6600', label: 'hill' },
  { color: '#C2FF00', label: 'bench' },
  { color: '#008FFF', label: 'countertop' },
  {
    color: '#33FF00',
    label: 'stove;kitchen;stove;range;kitchen;range;cooking;stove',
  },
  { color: '#0052FF', label: 'palm;palm;tree' },
  { color: '#00FF29', label: 'kitchen;island' },
  {
    color: '#00FFAD',
    label:
      'computer;computing;machine;computing;device;data;processor;electronic;computer;information;processing;system',
  },
  { color: '#0A00FF', label: 'swivel;chair' },
  { color: '#ADFF00', label: 'boat' },
  { color: '#00FF99', label: 'bar' },
  { color: '#FF5C00', label: 'arcade;machine' },
  { color: '#FF00FF', label: 'hovel;hut;hutch;shack;shanty' },
  {
    color: '#FF00F5',
    label:
      'bus;autobus;coach;charabanc;double-decker;jitney;motorbus;motorcoach;omnibus;passenger;vehicle',
  },
  { color: '#FF0066', label: 'towel' },
  { color: '#FFAD00', label: 'light;light;source' },
  { color: '#FF0014', label: 'truck;motortruck' },
  { color: '#FFB8B8', label: 'tower' },
  { color: '#001FFF', label: 'chandelier;pendant;pendent' },
  { color: '#00FF3D', label: 'awning;sunshade;sunblind' },
  { color: '#0047FF', label: 'streetlight;street;lamp' },
  { color: '#FF00CC', label: 'booth;cubicle;stall;kiosk' },
  {
    color: '#00FFC2',
    label:
      'television;television;receiver;television;set;tv;tv;set;idiot;box;boob;tube;telly;goggle;box',
  },
  { color: '#00FF52', label: 'airplane;aeroplane;plane' },
  { color: '#000AFF', label: 'dirt;track' },
  { color: '#0070FF', label: 'apparel;wearing;apparel;dress;clothes' },
  { color: '#3300FF', label: 'pole' },
  { color: '#00C2FF', label: 'land;ground;soil' },
  {
    color: '#007AFF',
    label: 'bannister;banister;balustrade;balusters;handrail',
  },
  { color: '#00FFA3', label: 'escalator;moving;staircase;moving;stairway' },
  { color: '#FF9900', label: 'ottoman;pouf;pouffe;puff;hassock' },
  { color: '#00FF0A', label: 'bottle' },
  { color: '#FF7000', label: 'buffet;counter;sideboard' },
  { color: '#8FFF00', label: 'poster;posting;placard;notice;bill;card' },
  { color: '#5200FF', label: 'stage' },
  { color: '#A3FF00', label: 'van' },
  { color: '#FFEB00', label: 'ship' },
  { color: '#08B8AA', label: 'fountain' },
  {
    color: '#8500FF',
    label: 'conveyer;belt;conveyor;belt;conveyer;conveyor;transporter',
  },
  { color: '#00FF5C', label: 'canopy' },
  { color: '#B800FF', label: 'washer;automatic;washer;washing;machine' },
  { color: '#FF001F', label: 'plaything;toy' },
  { color: '#00B8FF', label: 'swimming;pool;swimming;bath;natatorium' },
  { color: '#00D6FF', label: 'stool' },
  { color: '#FF0070', label: 'barrel;cask' },
  { color: '#5CFF00', label: 'basket;handbasket' },
  { color: '#00E0FF', label: 'waterfall;falls' },
  { color: '#70E0FF', label: 'tent;collapsible;shelter' },
  { color: '#46B8A0', label: 'bag' },
  { color: '#A300FF', label: 'minibike;motorbike' },
  { color: '#9900FF', label: 'cradle' },
  { color: '#47FF00', label: 'oven' },
  { color: '#FF00A3', label: 'ball' },
  { color: '#FFCC00', label: 'food;solid;food' },
  { color: '#FF008F', label: 'step;stair' },
  { color: '#00FFEB', label: 'tank;storage;tank' },
  { color: '#85FF00', label: 'trade;name;brand;name;brand;marque' },
  { color: '#FF00EB', label: 'microwave;microwave;oven' },
  { color: '#F500FF', label: 'pot;flowerpot' },
  {
    color: '#FF007A',
    label: 'animal;animate;being;beast;brute;creature;fauna',
  },
  { color: '#FFF500', label: 'bicycle;bike;wheel;cycle' },
  { color: '#0ABED4', label: 'lake' },
  { color: '#D6FF00', label: 'dishwasher;dish;washer;dishwashing;machine' },
  { color: '#00CCFF', label: 'screen;silver;screen;projection;screen' },
  { color: '#1400FF', label: 'blanket;cover' },
  { color: '#FFFF00', label: 'sculpture' },
  { color: '#0099FF', label: 'hood;exhaust;hood' },
  { color: '#0029FF', label: 'sconce' },
  { color: '#00FFCC', label: 'vase' },
  { color: '#2900FF', label: 'traffic;light;traffic;signal;stoplight' },
  { color: '#29FF00', label: 'tray' },
  {
    color: '#AD00FF',
    label:
      'ashcan;trash;can;garbage;can;wastebin;ash;bin;ash-bin;ashbin;dustbin;trash;barrel;trash;bin',
  },
  { color: '#00F5FF', label: 'fan' },
  { color: '#4700FF', label: 'pier;wharf;wharfage;dock' },
  { color: '#7A00FF', label: 'crt;screen' },
  { color: '#00FFB8', label: 'plate' },
  { color: '#005CFF', label: 'monitor;monitoring;device' },
  { color: '#B8FF00', label: 'bulletin;board;notice;board' },
  { color: '#0085FF', label: 'shower' },
  { color: '#FFD600', label: 'radiator' },
  { color: '#19C2C2', label: 'glass;drinking;glass' },
  { color: '#66FF00', label: 'clock' },
  { color: '#5C00FF', label: 'flag' },
]

function get_position_style(ctx, widget_width, y, node_height) {
  const MARGIN = 20
  const elRect = ctx.canvas.getBoundingClientRect()
  const transform = new DOMMatrix()
    .scaleSelf(
      elRect.width / ctx.canvas.width,
      elRect.height / ctx.canvas.height
    )
    .multiplySelf(ctx.getTransform())
    .translateSelf(MARGIN, MARGIN + y)

  return {
    transformOrigin: '0 0',
    transform: transform.toString(),
    left: `0px`,
    top: `0px`,
    position: 'absolute',
    maxWidth: `${widget_width - MARGIN * 2}px`,
    maxHeight: `${node_height - MARGIN * 2}px`,
    width: `auto`,
    height: `auto`,
  }
}

app.registerExtension({
  name: 'Comfy.RenderSpace',
  beforeRegisterNodeDef(nodeType, nodeData, app) {
    if (nodeType.comfyClass === 'RenderSpace') {
      const orig_nodeCreated = nodeType.prototype.onNodeCreated
      nodeType.prototype.onNodeCreated = function () {
        orig_nodeCreated?.apply(this, arguments)

        const container = document.createElement('div')
        container.style.display = 'flex'
        container.style.flexDirection = 'row'
        container.style.width = '100%'
        container.style.height = '100%'
        container.style.border = '1px solid #000'

        const canvasContainer = document.createElement('div')
        canvasContainer.style.flex = '1'
        canvasContainer.style.position = 'relative'
        canvasContainer.style.borderRight = '1px solid #000'

        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.id = 'renderSpaceCanvas'
        canvasContainer.appendChild(canvas)
        container.appendChild(canvasContainer)

        const toolsContainer = document.createElement('div')
        toolsContainer.style.flex = '0 0 150px'
        toolsContainer.style.display = 'flex'
        toolsContainer.style.flexDirection = 'column'
        toolsContainer.style.padding = '10px'

        const resolutionDropdown = document.createElement('select')
        resolutionDropdown.style.width = '100%'
        resolutionDropdown.style.marginBottom = '10px'
        resolutions.forEach((res, index) => {
          const option = document.createElement('option')
          option.value = index
          option.text = res.label
          resolutionDropdown.appendChild(option)
        })
        const resolutionLabel = document.createElement('label')
        resolutionLabel.textContent = 'Resolution:'
        const resolutionWrapper = document.createElement('div')
        resolutionWrapper.appendChild(resolutionLabel)
        resolutionWrapper.appendChild(resolutionDropdown)
        toolsContainer.appendChild(resolutionWrapper)

        const colorDropdown = document.createElement('select')
        colorDropdown.style.width = '100%'
        colorDropdown.style.marginBottom = '10px'
        colors.forEach((color, index) => {
          const option = document.createElement('option')
          option.value = index
          option.text = color.label
          option.style.backgroundColor = color.color
          option.style.color = getContrastYIQ(color.color)
          colorDropdown.appendChild(option)
        })
        const colorLabel = document.createElement('label')
        colorLabel.textContent = 'Brush Color:'
        const colorWrapper = document.createElement('div')
        colorWrapper.appendChild(colorLabel)
        colorWrapper.appendChild(colorDropdown)
        toolsContainer.appendChild(colorWrapper)

        const brushSizeInput = document.createElement('input')
        brushSizeInput.type = 'number'
        brushSizeInput.min = '1'
        brushSizeInput.max = '1000'
        brushSizeInput.value = '20'
        brushSizeInput.style.width = '100%'
        brushSizeInput.style.marginBottom = '10px'
        const brushSizeLabel = document.createElement('label')
        brushSizeLabel.textContent = 'Brush Size:'
        const brushSizeWrapper = document.createElement('div')
        brushSizeWrapper.appendChild(brushSizeLabel)
        brushSizeWrapper.appendChild(brushSizeInput)
        toolsContainer.appendChild(brushSizeWrapper)

        const eraserButton = document.createElement('button')
        eraserButton.textContent = 'Toggle Eraser'
        eraserButton.style.width = '100%'
        eraserButton.style.marginBottom = '10px'
        toolsContainer.appendChild(eraserButton)

        const fillCanvasButton = document.createElement('button')
        fillCanvasButton.textContent = 'Fill Canvas'
        fillCanvasButton.style.width = '100%'
        fillCanvasButton.style.marginBottom = '10px'
        toolsContainer.appendChild(fillCanvasButton)

        const resetButton = document.createElement('button')
        resetButton.textContent = 'Reset'
        resetButton.style.width = '100%'
        resetButton.style.marginBottom = '10px'
        toolsContainer.appendChild(resetButton)

        const undoButton = document.createElement('button')
        undoButton.textContent = 'Undo'
        undoButton.style.width = '100%'
        undoButton.style.marginBottom = '10px'
        toolsContainer.appendChild(undoButton)

        const realtimeQueueCheckbox = document.createElement('input');
        realtimeQueueCheckbox.type = 'checkbox';
        realtimeQueueCheckbox.style.marginBottom = '10px';
        const realtimeQueueLabel = document.createElement('label');
        realtimeQueueLabel.textContent = 'Enable Realtime Queueing:';
        const realtimeQueueWrapper = document.createElement('div');
        realtimeQueueWrapper.appendChild(realtimeQueueLabel);
        realtimeQueueWrapper.appendChild(realtimeQueueCheckbox);
        toolsContainer.appendChild(realtimeQueueWrapper);

        const uploadImageInput = document.createElement('input')
        uploadImageInput.type = 'file'
        uploadImageInput.style.width = '100%'
        uploadImageInput.style.marginBottom = '10px'
        toolsContainer.appendChild(uploadImageInput)

        const historyContainer = document.createElement('div')
        historyContainer.style.width = '100%'
        historyContainer.style.marginBottom = '10px'
        toolsContainer.appendChild(historyContainer)

        container.appendChild(toolsContainer)

        const ctx = canvas.getContext('2d')

        let mouseX = 0
        let mouseY = 0
        let isDrawing = false
        let selectedResolution = resolutions[0]
        let selectedColor = colors[0].color
        let brushSize = parseInt(brushSizeInput.value, 10)
        let history = []
        let historyColors = []
        let eraserMode = false

        const setNodeSize = () => {
          setTimeout(() => {
            this.size = [
              selectedResolution.width + toolsContainer.offsetWidth,
              selectedResolution.height + 100,
            ] // Set the node size to fit the canvas and tools
          }, 0)
        }

        const setCanvasSize = () => {
          canvas.width = selectedResolution.width
          canvas.height = selectedResolution.height
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          history = []
          historyColors = []
          updateHistoryDisplay()
          setNodeSize()
        }

        const saveHistory = () => {
          history.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
          historyColors.push(selectedColor)
          updateHistoryDisplay()
        }

        const updateHistoryDisplay = () => {
          const nonduplicateHistoryColors = [...new Set(historyColors)]
          historyContainer.innerHTML = `History: ${nonduplicateHistoryColors
            .filter((color) => color)
            .map((color) => {
              const colorObj = colors.find((c) => c.color === color)
              if (colorObj) {
                return `<div style="background-color:${color}; padding: 2px 10px; margin-bottom: 2px; border: 1px solid #000;">
                        ${colorObj.label}
                      </div>`
              }
              return ''
            })
            .join('')}`
        }

        resolutionDropdown.addEventListener('change', (e) => {
          selectedResolution = resolutions[e.target.value]
          setCanvasSize()
        })

        colorDropdown.addEventListener('change', (e) => {
          selectedColor = colors[e.target.value].color
        })

        brushSizeInput.addEventListener('input', (e) => {
          brushSize = parseInt(e.target.value, 10)
        })

        fillCanvasButton.addEventListener('click', () => {
          ctx.fillStyle = selectedColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          saveHistory()
        })

        resetButton.addEventListener('click', () => {
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          historyColors = []
          history = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
          updateHistoryDisplay()
        })

        undoButton.addEventListener('click', () => {
          if (history.length > 0) {
            history.pop()
            historyColors.pop()
            const lastState =
              history.length > 0 ? history[history.length - 1] : null
            if (lastState) {
              ctx.putImageData(lastState, 0, 0)
            } else {
              ctx.fillStyle = 'white'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
            updateHistoryDisplay()
          }
        })

        eraserButton.addEventListener('click', () => {
          eraserMode = !eraserMode
          eraserButton.textContent = eraserMode ? 'Switch to Brush' : 'Toggle Eraser'
        })

        uploadImageInput.addEventListener('change', (e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = function (event) {
              const img = new Image()
              img.onload = function () {
                // Set the selectedResolution to the image's resolution
                selectedResolution = {
                  width: img.width,
                  height: img.height,
                  label: `${img.width}x${img.height}`
                }
                
                // Resize the canvas to match the image resolution
                setCanvasSize()
        
                // Draw the uploaded image onto the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                saveHistory()
              }
              img.src = event.target.result
            }
            reader.readAsDataURL(file)
          }
        })

        setCanvasSize()
        const debouncedQueuePrompt = debounce(() => app.queuePrompt(), DEBOUNCE_QUEUE_INTERVAL_MS);

        canvas.addEventListener('mousedown', function (event) {
          debouncedQueuePrompt.cancel();
          setMouseCoordinates(event)
          isDrawing = true
          ctx.strokeStyle = eraserMode ? 'white' : selectedColor
          ctx.lineWidth = brushSize
          ctx.beginPath()
          ctx.moveTo(mouseX, mouseY)
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
        })

        canvas.addEventListener('mousemove', function (event) {
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          setMouseCoordinates(event)
          if (isDrawing) {
            ctx.lineTo(mouseX, mouseY)
            ctx.stroke()
          }
        })

        canvas.addEventListener('mouseup', function (event) {
          setMouseCoordinates(event)
          isDrawing = false
          saveHistory()
          if (realtimeQueueCheckbox.checked) {
            debouncedQueuePrompt();
          }
        })

        function setMouseCoordinates(e) {
          const rect = canvas.getBoundingClientRect()
          const scaleX = canvas.width / rect.width
          const scaleY = canvas.height / rect.height
          mouseX = (e.clientX - rect.left) * scaleX + 0.5
          mouseY = (e.clientY - rect.top) * scaleY + 0.5
        }

        const widget = {
          type: 'BASE64',
          name: 'canvas_data',
          size: [canvas.width, canvas.height],
          draw(ctx, node, width, y) {
            Object.assign(
              this.inputEl.style,
              get_position_style(ctx, node.size[0], y, node.size[1])
            )
          },
          inputEl: container,
          async serializeValue(nodeId, widgetIndex) {
            const canvasDataURL = canvas.toDataURL()
            return canvasDataURL
          },
        }

        document.body.appendChild(widget.inputEl)

        this.addCustomWidget(widget)
        this.onRemoved = function () {
          widget.inputEl.remove()
        }
        this.serialize_widgets = false
      }
    }
  },
})

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '')
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

function debounce(func, wait) {
  let timeout;
  function debounced(...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(this, args), wait);
  }
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
