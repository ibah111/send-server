export default function generateContext(user_id: number) {
  return `DECLARE @BinVar varbinary(128);
    DECLARE @StrVar nvarchar(128);
    SET @StrVar = '${user_id};';
    SET @BinVar =CAST(@StrVar as varbinary(128))
    SET CONTEXT_INFO @BinVar;
    GO;`;
}
