# KTHB Hold Shelf Numbers Alma
Hanterar att skapa löpnummer för hämthyllan för varje låntagare

## Funktioner
NodeJS-tjänst med koppling till MySQL-databas

Anropas från Alma-letters XSL:
```js
<xsl:if test="code='Primary Identifier'">
    <xsl:variable name="primaryid">
        <xsl:value-of select="substring-before(value,'@')"/>
    </xsl:variable>
    <xsl:variable name="additionalid">
        <xsl:value-of select="/notification_data/additional_id"/>
    </xsl:variable>
    <xsl:variable name="holdshelfnumber" select="document(concat('https://lib.kth.se/holdshelfno/api/v1/', $primaryid, '/',$additionalid,'/?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))">
    </xsl:variable>
    <xsl:value-of select="$holdshelfnumber/holdshelfnumber/userid_encrypted"/>
    <xsl:value-of select="'-'"/>
    <xsl:value-of select="$holdshelfnumber/holdshelfnumber/holdshelfnumber"/>
</xsl:if>
```
 

### Används för xxxx

### Bla bla bla

#### Bla bla bla