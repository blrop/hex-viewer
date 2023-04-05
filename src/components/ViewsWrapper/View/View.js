import Item from "../Item/Item";

const isSecondarySelected = ({ currentIndex, firstByteIndex, selectedByteIndex, totalBytesInGroup }) =>
    firstByteIndex <= selectedByteIndex && selectedByteIndex < (firstByteIndex + totalBytesInGroup) &&
    selectedByteIndex !== currentIndex;

const renderByte = ({ viewType, bytes, firstByteIndex, indexInGroup, selectedByteIndex, onByteClick }) => {
    const innerByteIndex = firstByteIndex + indexInGroup;
    const isSecondarySelectedValue = isSecondarySelected({
        currentIndex: innerByteIndex,
        firstByteIndex,
        selectedByteIndex,
        totalBytesInGroup: bytes.length
    });

    return (
        <Item
            viewType={ viewType }
            key={ `${ firstByteIndex }-${ indexInGroup }` }
            index={ innerByteIndex }
            onClick={ onByteClick }
            isSelected={ selectedByteIndex === innerByteIndex }
            isSecondarySelected={ isSecondarySelectedValue }
            bytes={ bytes }
            indexInGroup={ indexInGroup }
        />
    );
};

const renderGroup = (group, firstByteIndex, selectedByteIndex, viewType, onByteClick) => {
    const itemParams = {
        viewType,
        bytes: group,
        firstByteIndex: firstByteIndex,
        indexInGroup: 0,
        selectedByteIndex,
        onByteClick,
    };

    const item = renderByte({
        ...itemParams,
        indexInGroup: 0,
    });
    const output = [item];
    for (let i = 1; i < group.length; i++) {
        const item = renderByte({
            ...itemParams,
            indexInGroup: i,
        })
        output.push(item);
    }
    return output;
};

function View({ byteGroups, onByteClick, selectedByteIndex, viewType }) {
    return byteGroups
        .map((group) => renderGroup(group.bytes, group.firstByteIndex, selectedByteIndex, viewType, onByteClick));
}

export default View;