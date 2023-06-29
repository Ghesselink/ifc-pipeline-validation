import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { statusToColor } from './mappings'
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { useEffect, useState } from 'react';

export default function SyntaxResult({ content, status }) {
  const [rows, setRows] = React.useState([])
  const [page, setPage] = useState(0);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setRows(content.slice(page * 10, page * 10 + 10))
  }, [page, content]);

  function renderMessage(error_instance, numWhitespace, numHighlight) {
    const beforeHighlight = error_instance.substring(0, numWhitespace);
    const highlightedChar = error_instance.substring(numWhitespace, numWhitespace + numHighlight);
    const afterHighlight = error_instance.substring(numWhitespace + numHighlight);
    return (
      <React.Fragment>
        {beforeHighlight}
        <span
          style={{
            textDecoration: 'underline',
            fontWeight: 'bold',
            backgroundColor: '#ddd',
            border: 'solid 1px red'
          }}
        >
          {highlightedChar}
        </span>
        {afterHighlight}
      </React.Fragment>
    );
  };

  return (
    <Paper sx={{overflow: 'hidden'}}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={["0"]}
        sx={{
          "width": "850px",
          "backgroundColor": statusToColor[status],
          ".MuiTreeItem-root .MuiTreeItem-root": { backgroundColor: "#ffffff80", overflow: "hidden" },
          ".MuiTreeItem-group .MuiTreeItem-content": { boxSizing: "border-box" },
          ".MuiTreeItem-group": { padding: "16px", marginLeft: 0 },
          "> li > .MuiTreeItem-content": { padding: "16px" },
          ".MuiTreeItem-content.Mui-expanded": { borderBottom: 'solid 1px black' },
          ".MuiTreeItem-group .MuiTreeItem-content.Mui-expanded": { borderBottom: 0 },
          ".caption" : { textTransform: 'capitalize' },
          ".subcaption" : { visibility: "hidden", fontSize: '80%' },
          ".MuiTreeItem-content.Mui-expanded .subcaption" : { visibility: "visible" },
          "table": { borderCollapse: 'collapse', fontSize: '80%' },
          "td, th": { padding: '0.2em 0.5em', verticalAlign: 'top' },
          ".pre": {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
          ".mono": { fontFamily: 'monospace, monospace', marginTop: '0.3em' }
        }}
      >
        <TreeItem nodeId="0" label="Syntax">
        { rows.length
            ? rows.map(item => {
              const msg_parts = item.msg.split('\n');
              const [_, numWhitespace, numHighlight] = msg_parts[msg_parts.length -1].match(/(\s*)(\^+)/).map(s => s.length);
              const error_instance = msg_parts[msg_parts.length - 2];

              const errorMessage = renderMessage(
                error_instance,
                numWhitespace,
                numHighlight
              );


                return <TreeView defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}>
                    <TreeItem nodeId="syntax-0" label={<div class='caption'>{(item.error_type || 'syntax_error').replace('_', ' ')}</div>}>
                      <table>
                        <thead>
                          <tr><th>Line</th><th>Column</th><th>Message</th></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{item.lineno}</td>
                            <td>{item.column}</td>
                            <td>
                              <span class='pre'>{item.msg.split('\n').slice(0, -2).join('\n')}</span>
                              <br /> {}
                              <span class='pre mono'>{errorMessage}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </TreeItem>
                  </TreeView>
              })
            : <div>{content ? "Valid" : "Not checked"}</div> }
          {
            content.length
            ? <TablePagination
                sx={{display: 'flex', justifyContent: 'center', backgroundColor: statusToColor[status]}}
                rowsPerPageOptions={[10]}
                component="div"
                count={content.length}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
              />
            : null
          }
        </TreeItem>
      </TreeView>
    </Paper>
  );
}