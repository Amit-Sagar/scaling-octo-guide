import React, {  useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {Button} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import { DeleteOutlined} from '@ant-design/icons';



const getItems = count =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `item-${k}`,
		content: ``,
  }));
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: "none",
	margin: `0 0 0 0`,
	background: isDragging ? "white" : "white",
  padding: '10px 0px 10px 50px',
	...draggableStyle
});

const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? "white" : "white",
	padding: '0 0 0 25',
  width: "100%",
  position: "relative"
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

const DragnDrop = (props) => {
	const [placeholderProps, setPlaceholderProps] = useState({});
	const [items, setItems] = useState(getItems()); 
   

	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}

    setPlaceholderProps({})
		setItems(items => reorder(items, result.source.index, result.destination.index));
	};

	const onDragUpdate = update => {
    if(!update.destination){
      return;
    }
		const draggableId = update.draggableId;
		const destinationIndex = update.destination.index;

		const domQuery = `[${queryAttr}='${draggableId}']`;
		const draggedDOM = document.querySelector(domQuery);

		if (!draggedDOM) {
			return;
		}
		const { clientHeight, clientWidth } = draggedDOM;

		const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) + [...draggedDOM.parentNode.children]
			.slice(0, destinationIndex)
			.reduce((total, curr) => {
				const style = curr.currentStyle || window.getComputedStyle(curr);
				const marginBottom = parseFloat(style.marginBottom);
				return total + curr.clientHeight + marginBottom;
			}, 0);

		setPlaceholderProps({
			clientHeight,
			clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
		});
	};

	return (
		<DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}
					>
						{items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										style={getItemStyle(
											snapshot.isDragging,
											provided.draggableProps.style
										)}
									>
										{item.content}

									</div>
								)}
							</Draggable>
						))}

						{provided.placeholder}
            <div style={{
              position: "absolute",
              top: placeholderProps.clientY,
              left: placeholderProps.clientX,
              height: placeholderProps.clientHeight,
              width: placeholderProps.clientWidth
            }}/>
					</div>
				)}
			</Droppable>
		</DragDropContext>

              
	);
};
export default DragnDrop;