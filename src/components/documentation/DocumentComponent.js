import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  border: 1px solid #121212;
  display: flex;
  justify-content: space-between;
`;

const RenderComponent = styled.div`
  padding: 25px;
  display: flex;
  align-items: center;
`;

const Documentation = styled.table``;

class DocumentComponent extends React.Component {
  render() {
    return (
      <Container>
        <RenderComponent>{this.props.component}</RenderComponent>
        <Documentation>
          <tr>
            <th>Prop</th>
            <th>Description</th>
            <th>Type</th>
            <th>Default value</th>
          </tr>
          {this.props.propDocs.map((doc) => {
            return (
              <tr>
                <td>{doc.prop}</td>
                <td>{doc.description}</td>
                <td>{doc.type}</td>
                <td>
                  <code>{doc.defaultValue}</code>
                </td>
              </tr>
            );
          })}
        </Documentation>
      </Container>
    );
  }
}

export default DocumentComponent;
