import React, {useState} from 'react';
import styled from 'styled-components';
import Pagination from 'react-js-pagination';

const Table = ({ data, itemsPerPage, columns, columnWidths }) => {
    const [activePage, setActivePage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    let currentItems;
    if (itemsPerPage) {
        const indexOfLastItem = activePage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
    } else {
        currentItems = data;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <StyledTable columnWidths={columnWidths}>
                <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {currentItems?.map((item, index) => (
                    <tr key={index}>
                        {columns.map((column, subIndex) => (
                            <td key={subIndex}>{column.render(item)}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </StyledTable>
            {itemsPerPage && (
                <PaginationWrapper>
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={data?.length || 0}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </PaginationWrapper>
            )}
        </div>
    );
};

const StyledTable = styled.table`
  font-family: 'AvenirBook', sans-serif;
  background-color: white;
  border-collapse: collapse;
  width: 115%;
  margin: 15px 0 0 0;
  font-size: 14px;

  & thead {
    border-bottom: 1px solid #ececec;
    font-size: 14px;
  }

  & tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  & th {
    padding: 16px;
    background-color: #f9f9f9;
  }

  & th:nth-child(${props => props.columnWidths ? props.columnWidths.length : 0}) {
    ${props => props.columnWidths ? props.columnWidths.map((width, i) => `
      &:nth-child(${i + 1}) {
        width: ${width}px;
      }
    `) : ''}
  }

  & td:nth-child(${props => props.columnWidths ? props.columnWidths.length : 0}) {
    ${props => props.columnWidths ? props.columnWidths.map((width, i) => `
      &:nth-child(${i + 1}) {
        width: ${width}px;
      }
    `) : ''}
  }

  & th, & td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 16px;
    border-bottom: 1px solid #ececec;
  }

  & td {
    padding: 20px 0;
    color: black;
    text-align: center;
  }
`;

const Button = styled.button`
  background-color: ${props => props.value > 35 ? '#f14646' : 'none'};
  color: ${props => props.value > 35 ? '#fff' : 'black'};
  padding: 7px;
  border-radius: 4px;
  border: none;
  transition: transform .2s;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    margin-left: 16px;
  
  .pagination {
    display: flex; 
    list-style-type: none;
    padding-inline-start: 0;
  }

  .pagination li {
    padding: 4px 8px; // Ajout d'un petit padding
    margin: 0 3px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination li a {
    color: #333; // Couleur personnalisée pour le texte des boutons
    text-decoration: none;
  }

  .pagination li.active {
    border: 1px solid blue; // Couleur personnalisée pour l'arrière-plan des boutons actifs ou survolés
  }

  .pagination li.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Table;
